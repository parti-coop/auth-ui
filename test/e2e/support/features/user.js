import { expect } from 'chai'

import { api_test_client } from '../api-test-client'

export function user_exists(attrs = {}) {
  return api_test_client.post('/v1/test/users', { attrs_set: [ attrs ] }).then(res => {
    return res.data[0]
  })
}

export function user_count() {
  return api_test_client.get('/v1/test/users').then(res => {
    return res.data.length
  })
}

export function user_does_not_exist(attrs) {
  return api_test_client.get('/v1/test/users', { params: attrs }).then(res => {
    if (res.data.length > 0) {
      return api_test_client.delete(`/v1/test/users/${res.data[0].id}`)
    }
  })
}

export function user_should_exist(attrs) {
  return api_test_client.get('/v1/test/users', { params: attrs })
    .then(res => {
      expect(res.data).to.not.be.empty
    })
}

export function user_should_not_exist(attrs) {
  return api_test_client.get('/v1/test/users', { params: attrs })
    .then(res => {
      expect(res.data).to.be.empty
    })
}

export function user_should_be_asked_to_provide_credential(browser) {
  return new Promise(resolve => {
    browser.exists('input[label="Email"]').then(exist => {
      expect(exist).to.be.true
      resolve()
    })
  })
}

export function user_should_have_password({user_id, password}) {
  return api_test_client.post(
    `/v1/test/users/${user_id}/verify-password`,
    { password: password }
  ).then(res => {
    expect(res.data).to.be.true
  })
}
