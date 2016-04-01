import R from 'ramda'
import moment from 'moment'
import axios from 'axios'
import qs from 'qs'
import normalize_url from 'normalize-url'

import { auth_api_url } from '../utils/parti-url'

const auth_ui_client = {
  client_id: process.env.AUTH_UI_CLIENT_ID,
  client_secret: process.env.AUTH_UI_CLIENT_SECRET
}

export const CLIENT_CREDENTIALS_GRANT_TYPE = 'client_credentials'

const auth_api_client = axios.create({
  baseURL: auth_api_url()
})

export function auth_ui_client_credential_token() {
  const { client_id, client_secret } = auth_ui_client
  return client_credential_token({
    client_id,
    client_secret
  })
}

let token_cache = {}

export function clear_token_cache() {
  token_cache = {}
}

export function client_credential_token({ client_id, client_secret }) {
  const cache_key = `${client_id}:${client_secret}`
  const expires_at = R.pathOr(moment(0), [cache_key, 'expires_at'], token_cache)
  if (expires_at.isSameOrAfter(moment())) {
    return new Promise(resolve => {
      setTimeout(() => resolve(token_cache[cache_key]))
    })
  }
  return auth_api_client.post(
    '/v1/tokens',
    { grant_type: CLIENT_CREDENTIALS_GRANT_TYPE },
    {
      auth: {
        username: client_id,
        password: client_secret
      },
      transformRequest: [ qs.stringify ]
    }
  ).then(res => {
    const token = res.data
    if (token.expires_in) {
      token.expires_at = moment().add(token.expires_in - 10, 's')
      token_cache[cache_key] = token
    }
    return token
  })
}
