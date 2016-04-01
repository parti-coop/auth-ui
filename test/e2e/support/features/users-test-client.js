import axios from 'axios'

import { users_api_url } from '../../../../src/utils/parti-url'
import { auth_ui_test_client_credential_token, } from './test-client'
import { add_token_header } from '../../../../src/helpers/auth-client'

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

