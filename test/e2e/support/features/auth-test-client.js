import { auth_ui_test_client_credential_token, } from './test-client'
import { delete_with_token, get_with_token, post_with_token } from '../../../../src/helpers/auth-client'

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
