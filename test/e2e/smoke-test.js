import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'
chai.use(chaiAsPromised)

import { equals as url_equals } from 'node-url-utils'
import axios from 'axios'

import config from '../../src/config';
import { createBrowser } from './support/browser'
import './support/setup-mocha'

describe('UI server', () => {
  it('is up', function *() {
    let port = process.env.AUTH_UI_PORT || config.port || 8080
    let server_url = `http://${config.host}:${port}`

    let url = yield createBrowser()
      .goto(server_url)
      .url()

    expect(url_equals(url, server_url)).to.be.true
  })
})

describe('API server', () => {
  it('is up', done => {
    let port = process.env.AUTH_API_PORT || config.apiPort || 3030
    let server_url = `http://${config.host}:${port}`
    expect(
      axios.get(server_url)
    ).to.be.fulfilled.notify(done)
  })
})
