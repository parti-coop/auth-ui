import axios from 'axios'
import health_check from 'express-healthcheck'
import { auth_api_url } from 'utils/auth-url'

function applyMiddlewares(app) {
  applyHealthCheck(app)
  return app
}

function applyHealthCheck(app) {
  app.use('/health-check', health_check({
    healthy: () => (
      { 'api-host': 'success' }
    ),
    test: done => {
      const auth_url = auth_api_url('/health_check')
      console.log(`Checking ${auth_url}`)
      axios.get(auth_url)
        .then(({ data }) => {
          if (data === 'success') {
            done()
          } else {
            done('health_check auth-api failed')
          }
        })
        .catch(err => {
          done(err)
        })
    }
  }))
}

export default applyMiddlewares
