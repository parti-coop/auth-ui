import axios from 'axios'
import qs from 'qs'
import normalize_url from 'normalize-url'

import config from '../../../../src/config'
import { users_api_url } from '../../../../src/utils/parti-url'
import { client_credential_token } from '../../../../src/helpers/auth-client'

const auth_ui_test_client = {
  client_id: process.env.AUTH_UI_TEST_CLIENT_ID,
  client_secret: process.env.AUTH_UI_TEST_CLIENT_SECRET
}

export default {
  get(path, options = {}) {
    return auth_ui_test_client_credential_token().then(token => {
      return get_with_token(token, path, options)
    })
  },

  post(path, data, options = {}) {
    return auth_ui_test_client_credential_token().then(token => {
      return post_with_token(token, path, data, options)
    })
  },

  delete(path, options = {}) {
    return auth_ui_test_client_credential_token().then(token => {
      return delete_with_token(token, path, options)
    })
  }
}

const users_api_client = axios.create({
  baseURL: users_api_url()
})

function get_with_token(token, path, options) {
  return users_api_client.get(path, add_token_header(token, options))
}

function post_with_token(token, path, data, options) {
  return users_api_client.post(path, data, add_token_header(token, options))
}

function delete_with_token(token, path, options) {
  return users_api_client.delete(path, add_token_header(token, options))
}

function add_token_header(token, params) {
  if (!params.hasOwnProperty('headers')) {
    params.headers = {}
  }
  Object.assign(params.headers, { 'Authorization': `Bearer ${token.access_token}` })
  return params
}

export function auth_ui_test_client_credential_token() {
  const { client_id, client_secret } = auth_ui_test_client
  return client_credential_token({
    client_id,
    client_secret
  })
}
