import { expect } from 'chai'

import users_test_client from './users-test-client'

export function user_exists(attrs = {}) {
  return users_test_client.post('/v1/test/users', { users: [ attrs ] }).then(res => {
    return res.data[0]
  })
}

export function user_count() {
  return users_test_client.get('/v1/test/users').then(res => {
    return res.data.length
  })
}

export function user_does_not_exist(attrs) {
  return users_test_client.get('/v1/test/users', { params: attrs }).then(res => {
    if (res.data.length > 0) {
      return users_test_client.delete(`/v1/test/users/${res.data[0].identifier}`)
    }
  })
}

export function user_should_exist(attrs) {
  return users_test_client.get('/v1/test/users', { params: attrs })
    .then(res => {
      expect(res.data).to.not.be.empty
    })
}

export function user_should_not_exist(attrs) {
  return users_test_client.get('/v1/test/users', { params: attrs })
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
  return users_test_client.post(
    `/v1/test/users/${user_id}/verify-password`,
    { password: password }
  ).then(res => {
    expect(res.data).to.be.true
  })
}
