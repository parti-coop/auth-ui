/* global scenario:true */
import { describe as feature, describe as context } from 'mocha'

import '../support/setup-mocha'
import auth_ui_test_client from '../support/features/auth-ui-test-client'
import { CREATE_CLIENT, OPENID } from '../../../src/models/scope'
import { access_token_is_granted } from '../support/features/token'
import {
  auth_code_is_requested,
  auth_code_should_be_returned,
  auth_code_should_be_valid,
  submit_user_credential
} from '../support/features/auth-code'
import { auth_ui_url } from '../../../src/utils/parti-url'
import { clean_database as clean_auth_database } from '../support/features/auth-database'
import { clean_database as clean_users_database } from '../support/features/users-database'
import { client_exists } from '../support/features/client'
import { createBrowser } from '../support/browser'
import { user_account_exists } from '../support/features/user-account'
import { user_exists } from '../support/features/user'

feature('Grant authorization code', () => {
  let browser

  beforeEach(() => {
    browser = createBrowser()
    return auth_ui_test_client.delete('/v1/test/token-caches').then(() => {
      return clean_users_database()
    }).then(() => {
      return clean_auth_database()
    })
  })

  afterEach((done) => {
    browser.end().then(() => done())
  })

  context('Client redirects user to authorization endpoint', () => {
    const redirect_uri = auth_ui_url('/about')

    scenario('User submits credential then authorization code is granted', function *() {
      const client = yield client_exists({ redirect_uris: [ redirect_uri ] })

      const user = yield user_exists({
        email: 'user@email.com',
        password: 'Passw0rd!'
      })

      yield auth_code_is_requested(browser, {
        client_id: client.client_id,
        nonce: 'random-nonce',
        redirect_uri,
        scopes: [ OPENID ],
        state: 'random-state'
      })

      yield submit_user_credential(browser, { user })

      const code = yield auth_code_should_be_returned(browser, { redirect_uri, state: 'random-state' })
      yield auth_code_should_be_valid({
        client_id: client.client_id,
        client_secret: client.client_secret,
        code,
        nonce: 'random-nonce',
        redirect_uri
      })
    })
  })
})
