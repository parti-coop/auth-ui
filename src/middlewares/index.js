import health_check from 'express-healthcheck'

function applyMiddlewares(app) {
  applyHealthCheck(app)
  return app
}

function applyHealthCheck(app) {
  app.use('/health-check', health_check({
    test: callback => {
      callback()
    }
  }))
}

export default applyMiddlewares
