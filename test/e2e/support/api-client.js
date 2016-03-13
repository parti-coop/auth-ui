import axios from 'axios'
import base64 from 'base-64'
import config from '../../../src/config'

export const CLIENT_CREDENTIALS_GRANT_TYPE = 'client_credentials'

export const api_test_client = {
  token: null,

  get(path, options = {}) {
    if (!this.token) {
      return client_credential_token().then(res => {
        this.token = res.data
        return get_with_token(this.token, path, options)
      })
    } else {
      return get_with_token(this.token, path, options)
    }
  },

  post(path, data, options = {}) {
    if (!this.token) {
      return client_credential_token().then(res => {
        this.token = res.data
        return post_with_token(this.token, path, data, options)
      })
    } else {
      return post_with_token(this.token, path, data, options)
    }
  },

  delete(path, options = {}) {
    if (!this.token) {
      return client_credential_token().then(res => {
        this.token = res.data
        return delete_with_token(this.token, path, options)
      })
    } else {
      return delete_with_token(this.token, path, options)
    }
  }
}

const rest_client = axios.create({
  baseURL: `http://${config.apiHost}:${config.apiPort}`
})

function client_credential_token() {
  const cred = basic_auth_credential(config.api.client_id, config.api.client_secret)
  return rest_client.post(
    '/v1/tokens',
    { grant_type: 'client_credentials' },
    {
      headers: { 'Authorization': `Basic ${cred}` },
      transformRequest: [ www_form_urlencoded ]
    }
  )
}

function add_token_header(token, params) {
  if (!params.hasOwnProperty('headers')) {
    params.headers = {}
  }
  Object.assign(params.headers, { 'Authorization': `Bearer ${token.access_token}` })
  return params
}

function get_with_token(token, path, options) {
  return rest_client.get(path, add_token_header(token, options))
}

function post_with_token(token, path, data, options) {
  return rest_client.post(path, data, add_token_header(token, options))
}

function delete_with_token(token, path, options) {
  return rest_client.delete(path, add_token_header(token, options))
}

function basic_auth_credential(id, secret) {
  return base64.encode(`${id}:${secret}`)
}

function www_form_urlencoded(data) {
  let str = []
  for(var p in data) {
    if (data.hasOwnProperty(p) && data[p]) {
      str.push(encodeURIComponent(p) + '=' + encodeURIComponent(data[p]))
    }
  }
  return str.join('&');
}
