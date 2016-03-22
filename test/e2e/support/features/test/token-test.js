import '../../setup-mocha'
import { clean_database } from '../database'
import {
  access_token_is_granted,
  access_token_should_be_granted
} from '../token'
import { user_account_exists } from '../user-account'
import { CREATE_CLIENT } from '../../../../../src/models/scope'

describe('token factory for test', () => {
  before(() => {
    return clean_database()
  })

  describe('access_token_is_granted', () => {
    it('grants token', function *() {
      const account = yield user_account_exists()

      const token = yield access_token_is_granted({
        account: { identifier: account.identifier },
        scopes: [ CREATE_CLIENT ]
      })

      yield access_token_should_be_granted({
        account: account,
        token: token,
        scopes: [ CREATE_CLIENT ]
      })
    })
  })
})
