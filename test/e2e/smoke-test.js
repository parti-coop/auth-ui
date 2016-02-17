import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'
chai.use(chaiAsPromised)

import axios from 'axios'
import url_equals from 'compare-urls'

import { auth_ui_url, auth_api_url } from 'utils/auth-url'
import { createBrowser } from './support/browser'
import './support/setup-mocha'

describe('UI server', () => {
  it('is up', function *() {
    let url = auth_ui_url('/')

    let current_url = yield createBrowser()
      .goto(url)
      .url()

    expect(url_equals(url, current_url)).to.be.true
  })
})

describe('API server', () => {
  it('is up', done => {
    let url = auth_api_url('/health_check')

    axios.get(url)
      .then(({ data }) => {
        expect(data).to.eq('success')
        done()
      })
      .catch(err => {
        console.log(err)
        done(err)
      })
  })
})
