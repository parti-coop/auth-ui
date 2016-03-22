import { assert, expect } from 'chai'

import '../../setup-mocha'
import { CREATE_CLIENT, OPENID } from '../../../../../src/models/scope'
import { access_token_is_granted } from '../token'
import { auth_ui_url } from '../../../../../src/utils/auth-url'
import { clean_database } from '../database'
import { client_exists } from '../client'
import { user_account_exists } from '../user-account'

describe('client test factory', () => {
  before(() => {
    return clean_database()
  })

  describe('client_exists', () => {
    it('creates client', function *() {
      const redirect_uri = auth_ui_url('/about')
      const account = yield user_account_exists()
      const token = yield access_token_is_granted({
        account: { identifier: account.identifier },
        scopes: [ CREATE_CLIENT ]
      })

      const client = yield client_exists({
        token: token.access_token,
        redirect_uris: [ redirect_uri ]
      })

      expect(client.redirect_uris).to.eql([ redirect_uri ])
      expect(client.client_id).to.exist
      expect(client.client_secret).to.exist
    })

    it('responds 401 unauthorized without create_client scope', function *() {
      const redirect_uri = auth_ui_url('/about')
      const account = yield user_account_exists()
      const token = yield access_token_is_granted({
        account: { identifier: account.identifier },
        scopes: [ OPENID ]
      })

      yield client_exists({
        token: token.access_token,
        redirect_uris: [ redirect_uri ]
      }).then(_res => {
        assert.fail('should not reach here')
      }).catch(err => {
        expect(err.status).to.equal(401)
      })
    })

    it('responds 401 unauthorized without token', function *() {
      const redirect_uri = auth_ui_url('/about')

      yield client_exists({
        redirect_uris: [ redirect_uri ]
      }).then(_res => {
        assert.fail('should not reach here')
      }).catch(err => {
        expect(err.status).to.equal(401)
      })
    })
  })
})
