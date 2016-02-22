import { expect } from 'chai'

export function user_should_be_asked_to_provide_credential(browser) {
  return new Promise(resolve => {
    browser.exists('input[label="Email"]').then(exist => {
      expect(exist).to.be.true
      resolve()
    })
  })
}
