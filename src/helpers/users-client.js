import axios from 'axios'

import { add_token_header } from './auth-client'
import { users_api_url } from '../utils/parti-url'

export default {
  get(path, options = {}) {
    return get_with_token(options.token, path, options)
  },

  post(path, data, options = {}) {
    return post_with_token(options.token, path, data, options)
  },

  delete(path, options = {}) {
    return delete_with_token(options.token, path, options)
  }
}

export const users_api_client = axios.create({
  baseURL: users_api_url()
})

export function get_with_token(token, path, options) {
  return users_api_client.get(path, add_token_header(token, options))
}

export function post_with_token(token, path, data, options) {
  return users_api_client.post(path, data, add_token_header(token, options))
}

export function delete_with_token(token, path, options) {
  return users_api_client.delete(path, add_token_header(token, options))
}

