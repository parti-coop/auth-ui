/* global scenario:true */
import { describe as feature, describe as context } from 'mocha'
import { createBrowser } from '../support/browser'
import { registered_client_exist } from '../support/features/client'
import {
  auth_code_is_requested,
  auth_code_should_be_granted,
  submit_user_credential
} from '../support/features/auth-code'
import {
  user_exists
} from '../support/features/user'
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
    scenario('User submits credential then authorization code is granted', function *() {
      const client = yield registered_client_exist()
      const user = yield user_exists(client)
      yield auth_code_is_requested(browser, {client})

      yield submit_user_credential(browser, {user})

      yield auth_code_should_be_granted(browser)
    })
  })
})
