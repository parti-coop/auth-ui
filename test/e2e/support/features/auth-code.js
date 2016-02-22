import { authorizations_url } from '../../../../src/utils/auth-url'

export function request_auth_code(browser) {
  return browser.goto(authorizations_url())
}

