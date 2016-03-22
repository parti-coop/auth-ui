import R from 'ramda'
import base64 from 'base-64'
import qs from 'qs'
import node_url from 'url'
import { expect } from 'chai'

import { api_client } from '../../../../src/helpers/api-client'
import { authorizations_url } from '../../../../src/utils/auth-url'

export function auth_code_is_requested(browser, params) {
  return request_auth_code(browser, params)
}

export function request_auth_code(browser, params) {
  const defaults = { response_type: 'code' }
  const query_obj = R.merge(defaults, params)
  const url = `${authorizations_url()}?${qs.stringify(query_obj)}`

  return new Promise(resolve => {
    browser
    .goto(url)
    .wait('input[label="Email"]')
    .then(() => {
      resolve()
    })
  })
}

export function submit_user_credential(browser, { user }) {
  return new Promise(resolve => {
    browser
    .type('input[label="Email"]', user.email)
    .type('input[label="Password"]', user.password)
    .click('input[value="Sign In"]')
    .then(() => {
      resolve()
    })
  })
}

export function auth_code_should_be_valid({ client_id, client_secret, code, _nonce, redirect_uri }) {
  const data = {
    code,
    grant_type: 'authorization_code',
    redirect_uri
  }
  const cred = base64.encode(`${client_id}:${client_secret}`)
  const options = {
    headers: { 'Authorization': `Basic ${cred}` },
    transformRequest: [ qs.stringify ]
  }
  return api_client.post('/v1/tokens', data, options).then(res => {
    expect(res.status).to.equal(200)
    expect(res.data.access_token).to.exist
    expect(res.data.expires_in).to.exist
  })
}

export function auth_code_should_be_returned(browser, { redirect_uri, state }) {
  return new Promise(resolve => {
    browser
    .wait(expected => {
      return document.location.href.startsWith(expected)
    }, redirect_uri)
    .url().then(url => {
      const query = qs.parse(node_url.parse(url).query)
      expect(query.state).to.equal(state)
      expect(query.code).to.exist
      resolve(query.code)
    })
  })
}
