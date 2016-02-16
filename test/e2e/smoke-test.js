import { expect } from 'chai'
import { equals as url_equals } from 'node-url-utils'

import config from '../../src/config';
import { createBrowser } from './support/browser'
import './support/setup-mocha'

describe('Browser', () => {
  it('connects to ui server', function *() {
    let port = process.env.AUTH_UI_PORT || config.port || 8080
    let server_url = `http://${config.host}:${port}`

    let url = yield createBrowser()
      .goto(server_url)
      .url()

    expect(url_equals(url, server_url)).to.be.true
  })
})
