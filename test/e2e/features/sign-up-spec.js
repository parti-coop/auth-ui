/* global scenario:true */
import { expect } from 'chai'
import { describe as feature } from 'mocha'
import '../support/setup-mocha'

import { createBrowser } from '../support/browser'
import {
  user_does_not_exist,
  user_should_exist
} from '../support/features/user'
import {
  sign_up,
  user_should_see_sign_up_confirmation_sent_page
} from '../support/features/sign-up'
import { user_should_see_message } from '../support/features/message'

feature('Signs up', () => {
  let browser
  beforeEach(() => {
    browser = createBrowser()
  })
  afterEach(() => {
    return new Promise(resolve => {
      browser.end().then(() => resolve())
    })
  })

  scenario('User signs up', function *() {
    yield user_does_not_exist({
      email: 'user@email.com'
    })
    yield sign_up(browser, {
      email: 'user@email.com',
      password: 'Passw0rd!'
    })
    yield user_should_see_sign_up_confirmation_sent_page(browser)
    yield user_should_exist({
      email: 'user@email.com'
    })
  })

  scenario('User sees message when password is too short', function *() {
    yield user_does_not_exist({
      email: 'user@email.com'
    })
    yield sign_up(browser, {
      email: 'user@email.com',
      password: 'a'
    })
    yield user_should_see_message(browser, message => {
      expect(message).to.match(/Password is too short/)
    })
  })
})
