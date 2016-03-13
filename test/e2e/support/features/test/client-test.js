import chai, { expect } from 'chai'
import chai_as_promised from 'chai-as-promised'
import { parse as parse_url } from 'url'
chai.use(chai_as_promised)

import { registered_client_exist } from '../client'

describe('registered_client_exist', () => {
  it('returns valid client model', done => {
    registered_client_exist().then(client => {
      expect(client.client_id).to.exist
      client.redirect_uris.forEach(uri => {
        expect(parse_url(uri).host).to.not.empty
      })
      done()
    }).catch(err => {
      done(err)
    })
  })

  it('builds with overriding attributes', done => {
    registered_client_exist({
      client_id: 'overrided-client-id',
      redirect_uris: ['http://overrided.url.com']
    }).then(client => {
      expect(client.client_id).to.equal('overrided-client-id')
      expect(client.redirect_uris).to.have.members(['http://overrided.url.com'])
      done()
    }).catch(err => {
      done(err)
    })
  })
})
