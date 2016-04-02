import { assert, expect } from 'chai'

import '../../setup-mocha'
import { CREATE_CLIENT, OPENID } from '../../../../../src/models/scope'
import { access_token_is_granted } from '../token'
import { auth_ui_url } from '../../../../../src/utils/parti-url'
import { clean_database } from '../auth-database'
import { client_exists } from '../client'
import { user_account_exists } from '../user-account'

describe('client test factory', () => {
  before(() => {
    return clean_database()
  })

  describe('client_exists', () => {
    it('creates client', function *() {
      const redirect_uri = auth_ui_url('/about')
      const client = yield client_exists()

      expect(client.redirect_uris).to.exist
      expect(client.client_id).to.exist
      expect(client.client_secret).to.exist
    })

    it('creates client with redirect_uris', function *() {
      const redirect_uri = auth_ui_url('/about')
      const client = yield client_exists({
        redirect_uris: [ redirect_uri ]
      })

      expect(client.redirect_uris).to.eql([ redirect_uri ])
      expect(client.client_id).to.exist
      expect(client.client_secret).to.exist
    })
  })
})
