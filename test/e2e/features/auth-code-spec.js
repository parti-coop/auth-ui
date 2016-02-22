/* global scenario:true */
import { describe as feature, describe as context } from 'mocha'
import { createBrowser } from '../support/browser'
import { registered_client_exist } from '../support/features/client'
import { request_auth_code } from '../support/features/auth-code'
import { user_should_be_asked_to_provide_credential } from '../support/features/user'

import '../support/setup-mocha'

feature('Grant authorization code', () => {
  let browser

  beforeEach(() => {
    browser = createBrowser()
  })
  afterEach(() => {
    browser.end()
  })

  context('Client redirects user to authorization endpoint', () => {
    scenario('User is asked to provide credential', function *() {
      const client = yield registered_client_exist()

      yield request_auth_code(browser, { client })

      yield user_should_be_asked_to_provide_credential(browser)
    })
  })
})
