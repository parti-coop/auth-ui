import { describe as feature, describe as context } from 'mocha'
import '../support/setup-mocha'
import { user_does_not_exist } from '../support/features/user'

feature('Signs up', () => {
  // before(() => {
  //   http_server = http.createServer((req, res) => {
  //     res.writeHead(200, { 'Content-Type': 'text/plain' })
  //     res.end('success')
  //   }).listen(8081)
  // })

  let browser
  beforeEach(() => {
    browser = createBrowser()
  })
  afterEach(() => {
    browser.end()
  })

  scenario('User signs up', function *() {
    yield user_does_not_exist({
      email: 'user@email.com'
    })
    yield sign_up({
      email: 'user@email.com',
      password: 'Passw0rd!'
    })
    user_should_be_created({
      email: 'user@email.com'
    })
  })
})
