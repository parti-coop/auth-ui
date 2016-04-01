import R from 'ramda'
import { expect } from 'chai'

import auth_test_client from './auth-test-client'
import { user_should_have_password } from './user'

export function user_account_exists(attrs = {}) {
  return auth_test_client.post('/v1/test/user-accounts', { attrs_set: [ attrs ] }).then(res => {
    return res.data[0]
  })
}

export function user_accounts_count() {
  return auth_test_client.get('/v1/test/user-accounts').then(res => {
    return res.data.length
  })
}

export function user_accounts_do_not_exist(attrs) {
  return auth_test_client.get('/v1/test/user-accounts',
    { params: { where: JSON.stringify(attrs) } }
  ).then(res => {
    const delete_api = identifier => {
      return auth_test_client.delete(`/v1/test/user-accounts/${identifier}`)
    }
    return Promise.all(
      R.map(
        R.compose(delete_api, R.prop('identifier')),
        res.data
      )
    )
  })
}

export function user_account_should_exist(attrs) {
  return auth_test_client.get('/v1/test/user-accounts',
    { params: { where: JSON.stringify(attrs) } }
  ).then(res => {
    expect(res.data).to.not.be.empty
    const password = R.path(['parti', 'password'], attrs)
    if (password) {
      const user_identifier = R.path(['parti', 'identifier'], res.data[0])
      expect(user_identifier).to.be.ok
      return user_should_have_password({user_identifier, password})
    }
  })
}
