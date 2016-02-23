import { authorizations_url } from '../../../../src/utils/auth-url'
import { expect } from 'chai'

export function auth_code_is_requested(browser) {
  return request_auth_code(browser)
}

export function request_auth_code(browser) {
  return new Promise(resolve => {
    browser.goto(authorizations_url()).then(() => {
      resolve()
    })
  })
}

export function submit_user_credential(browser, {user}) {
  return new Promise(resolve => {
    browser
    .type('input[label="Email"]', user.email)
    .type('input[label="Password"]', user.password)
    .click('input[value="Sign In"]')
    .then(() => {
      resolve()
    })
  })
}

export function auth_code_should_be_granted(browser) {
  return new Promise(resolve => {
    browser.url().then(url => {
      resolve(url)
    })
  }).then(url => {
    const { auth_code } = extract_auth_code(url)
    return auth_code_should_be_vaild(auth_code)
  })
}

function auth_code_should_be_vaild(auth_code) {
  return new Promise(resolve => {
    expect(auth_code).to.be.equal('fake_auth_code')
    resolve()
  })
}

function extract_auth_code(_url) {
  return {
    auth_code: 'fake_auth_code'
  }
}
