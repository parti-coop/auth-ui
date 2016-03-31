import sinon from 'sinon'
import path from 'path'
import { expect } from 'chai'

import { users_api_port } from '../../src/utils/parti-url'

describe('parti-url', () => {
  describe('users_api_port', () => {
    it('returns default when env is empty', () => {
      sinon.sandbox.create().stub(process, 'env', {})
      expect(users_api_port()).to.equals(3030)
    })

    it('returns default when env is invalid', () => {
      sinon.sandbox.create().stub(process, 'env', { USERS_API_PORT: 'not-a-number' })
      expect(users_api_port()).to.equals(3030)
    })

    it('gets value from env', () => {
      sinon.sandbox.create().stub(process, 'env', { USERS_API_PORT: '3040' })
      expect(users_api_port()).to.equals(3040)
    })

    it('returns from env of docker link', () => {
      sinon.sandbox.create().stub(process, 'env', { USERS_API_PORT: 'tcp://172.17.0.3:3050' })
      expect(users_api_port()).to.equals(3050)
    })
  })
})
