import { expect } from 'chai'

import { api_client } from '../api-client'
import { auth_ui_url } from '../../../../src/utils/auth-url'

export function sign_up(browser, {email, password}) {
  return new Promise(resolve => {
    browser
    .goto(auth_ui_url('/sign-up'))
    .type('input[label="Email"]', email)
    .type('input[label="Password"]', password)
    .type('input[label="Password Confirmation"]', password)
    .click('input[value="Sign Up"]')
    .then(() => {
      resolve()
    })
  })
}

