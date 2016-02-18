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
      axios.get(auth_api_url('/health_check'))
        .then(({ data }) => {
          if (data == 'success') {
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
