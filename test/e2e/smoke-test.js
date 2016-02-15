import { expect } from 'chai'
import { equals as url_equals } from 'node-url-utils'

import config from '../../src/config';
import { createBrowser } from './support/browser'
import './support/setup-mocha'

describe('Browser', () => {
  it('connects to test server', function *() {
    let port = config.port || 8080
    let server_url = `http://${config.host}:${port}`
    console.log(server_url)
    let url = yield createBrowser()
      .goto(server_url)
      .url()

    console.log(url)
    // expect(url_equals(url, server_url)).to.be.true
  })
})
