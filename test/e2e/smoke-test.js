import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'
chai.use(chaiAsPromised)

import axios from 'axios'
import url_equals from 'compare-urls'

import { auth_ui_url, auth_api_url } from '../../src/utils/auth-url'
import { createBrowser } from './support/browser'
import './support/setup-mocha'

describe('UI server', () => {
  it('is up', done => {
    axios.get(auth_ui_url('/health-check'))
      .then(response => {
        expect(response.status).to.equal(200)
        expect(response.data['api-host']).to.equals('success')
        done()
      })
      .catch(err => {
        console.log(err)
        done(err)
      })
  })
})

describe('API server', () => {
  it('is up', done => {
    const url = auth_api_url('/health_check')

    axios.get(url)
      .then(({ data }) => {
        expect(data).to.equal('success')
        done()
      })
      .catch(err => {
        console.log(err)
        done(err)
      })
  })
})

describe('browser', () => {
  let browser
  beforeEach(() => {
    browser = createBrowser()
  })
  afterEach((done) => {
    browser.end().then(() => { done() })
  })

  it ('connects to auth-ui', function*() {
    const url = auth_ui_url('/')
    const current_url = yield browser.goto(url).url()

    expect(url_equals(url, current_url)).to.be.true
  })
})
