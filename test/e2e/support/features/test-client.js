import axios from 'axios'
import qs from 'qs'
import normalize_url from 'normalize-url'

import { client_credential_token } from '../../../../src/helpers/auth-client'

export const auth_ui_test_client = {
  client_id: process.env.AUTH_UI_TEST_CLIENT_ID,
  client_secret: process.env.AUTH_UI_TEST_CLIENT_SECRET
}

export function auth_ui_test_client_credential_token() {
  const { client_id, client_secret } = auth_ui_test_client
  return client_credential_token({
    client_id,
    client_secret
  })
}
