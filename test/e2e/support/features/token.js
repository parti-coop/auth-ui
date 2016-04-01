import { expect } from 'chai'

import auth_test_client from './auth-test-client'
import { auth_api_client } from '../../../../src/helpers/auth-client'
import { post_with_token } from '../../../../src/helpers/auth-client'

export function access_token_is_granted({ account: { identifier }, scopes = []}) {
  return auth_test_client.post(
    `/v1/test/user-accounts/${identifier}/tokens`,
    { scopes }
  ).then(res => {
    return res.data
  })
}

export function access_token_should_be_granted({ account, token, scopes = null }) {
  return post_with_token(
    token, 
    '/v1/introspect',
    { token: token.access_token }
  ).then(res => {
    expect(res.data.active).to.be.true
    if (scopes) {
      expect(scopes.join(' ')).to.equal(res.data.scope)
    }
  })
}
