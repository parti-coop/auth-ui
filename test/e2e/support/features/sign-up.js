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

export function user_should_see_sign_up_confirmation_sent_page(browser) {
  return new Promise(resolve => {
    browser.wait(() => {
      return document.location.pathname === '/sign-up-confirmation-sent'
    }).then(() => {
      resolve()
    })
  })
}
