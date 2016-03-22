import { expect } from 'chai'

import '../../setup-mocha'
import { clean_database } from '../database'
import {
  user_accounts_count,
  user_accounts_do_not_exist,
  user_account_exists,
  user_account_should_exist
} from '../user-account'

describe('user_account test factory', () => {
  before(() => {
    return clean_database()
  })

  describe('user_account_exists', () => {
    it('increases user_account count', function *() {
      const before_count = yield user_accounts_count()
      yield user_account_exists()
      const after_count = yield user_accounts_count()
      expect(after_count).to.equals(before_count + 1)
    })

    it('creates user account with parti email and password', function *() {
      yield user_accounts_do_not_exist({ email: 'one@email.com' })
      const account = yield user_account_exists({
        parti: {
          email: 'one@email.com',
          password: 'OnePassword!'
        }
      })
      expect(account.parti.email).to.be.equals('one@email.com')
      expect(account.parti.password).to.be.equals('OnePassword!')
      yield user_account_should_exist({
        parti: {
          email: 'one@email.com',
          password: 'OnePassword!'
        }
      })
    })

    describe('user_accounts_do_not_exist', () => {
      it('does nothing when user_accounts do not exist', function *() {
        const before_count = yield user_accounts_count()
        yield user_accounts_do_not_exist({ parti: { email: 'not-exist@email.com' }})
        const after_count = yield user_accounts_count()
        expect(before_count).to.eq(after_count)
      })

      it('removes all accounts with invalid params', function *() {
        yield user_accounts_do_not_exist({ parti: 'invalid-params' })
        const after_count = yield user_accounts_count()
        expect(after_count).to.eq(0)
      })
    })
  })
})
