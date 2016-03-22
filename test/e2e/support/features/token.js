import { expect } from 'chai'

import { api_test_client } from '../api-test-client'
import { api_client } from '../../../../src/helpers/api-client'

export function access_token_is_granted({ account: { identifier }, scopes = []}) {
  return api_test_client.post(
    `/v1/test/user-accounts/${identifier}/tokens`,
    { scopes }
  ).then(res => {
    return res.data
  })
}

export function access_token_should_be_granted({ account, token, scopes = null }) {
  return api_client.post(
    '/v1/introspect',
    { token: token.access_token },
    { token: token.access_token }
  ).then(res => {
    expect(res.data.active).to.be.true
    if (scopes) {
      expect(scopes.join(' ')).to.equal(res.data.scope)
    }
  })
}
