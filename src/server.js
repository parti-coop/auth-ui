import Express from 'express'
import PrettyError from 'pretty-error'
import R from 'ramda'
import React from 'react'
import ReactDOM from 'react-dom/server'
import bodyParser from 'body-parser'
import compression from 'compression'
import createHistory from 'react-router/lib/createMemoryHistory'
import createStore from './redux/create'
import favicon from 'serve-favicon'
import http from 'http'
import httpProxy from 'http-proxy'
import path from 'path'
import request_promise from 'request-promise'
import { Provider } from 'react-redux'
import { ReduxAsyncConnect, loadOnServer } from 'redux-async-connect'
import { match } from 'react-router'

import client from './helpers/ApiClient'
import Html from './helpers/Html'
import applyMiddleware from './middlewares'
import config from './config'
import getRoutes from './routes'
import { auth_ui_client_credential_token } from './helpers/auth-client'
import users_client from './helpers/users-client'
import { auth_api_url } from './utils/parti-url'

const targetUrl = 'http://' + config.apiHost + ':' + config.apiPort
const pretty = new PrettyError()
const app = new Express()
const server = new http.Server(app)
const proxy = httpProxy.createProxyServer({
  target: targetUrl,
  ws: false
})

app.use(compression())
app.use(favicon(path.join(__dirname, '..', 'static', 'favicon.ico')))

app.use(Express.static(path.join(__dirname, '..', 'static')))

applyMiddleware(app)

const sign_in_handlers = [
  bodyParser.urlencoded({ extended: true }),
  bodyParser.json()
]

app.post('/v1/sign-in', sign_in_handlers, (req, res) => {
  const data = R.pick(['email', 'password'], req.body)
  auth_ui_client_credential_token().then(token => {
    console.log('sign in with token: ' + token.access_token)
    return users_client.post('/v1/users/sign_in', data, { token })
  }).then(users_res => {
    const form = R.pick(['client_id', 'nonce', 'response_type', 'scope', 'state'], req.body)
    const headers = R.pick(['access-token', 'client', 'uid'], users_res.headers)
    return request_promise({
      form,
      headers,
      method: 'POST',
      resolveWithFullResponse: true,
      simple: false,
      uri: auth_api_url('/v1/authorizations')
    })
  }).then(auth_res => {
    let status_code = auth_res.statusCode
    let headers = R.pick(['content-type'], auth_res.headers)
    if (status_code === 302) {
      status_code = 200
      headers = R.merge(headers, R.pick(['location'], auth_res.headers))
    }
    res.writeHead(status_code, auth_res.statusMessage, auth_res.headers)
    res.end(auth_res.body)
  }).catch(err => {
    console.log(err)
    const headers = R.pick(['content-type'], err.headers)
    res.writeHead(err.status, err.statusText, headers)
    res.end(JSON.stringify(err.data))
  })
})

app.use('/ws', (req, res) => {
  proxy.web(req, res, {target: targetUrl + '/ws'})
})

server.on('upgrade', (req, socket, head) => {
  proxy.ws(req, socket, head)
})

// added the error handling to avoid https://github.com/nodejitsu/node-http-proxy/issues/527
proxy.on('error', (error, req, res) => {
  let json
  if (error.code !== 'ECONNRESET') {
    console.error('proxy error', error)
  }
  if (!res.headersSent) {
    res.writeHead(500, {'content-type': 'application/json'})
  }

  json = {error: 'proxy_error', reason: error.message}
  res.end(JSON.stringify(json))
})

app.use((req, res) => {
  if (__DEVELOPMENT__) {
    // Do not cache webpack stats: the script file would change since
    // hot module replacement is enabled in the development env
    webpackIsomorphicTools.refresh()
  }
  const history = createHistory(req.originalUrl)

  const store = createStore(history, client)

  function hydrateOnClient() {
    res.send('<!doctype html>\n' +
      ReactDOM.renderToString(<Html assets={webpackIsomorphicTools.assets()} store={store}/>))
  }

  if (__DISABLE_SSR__) {
    hydrateOnClient()
    return
  }

  match({ history, routes: getRoutes(store), location: req.originalUrl }, (error, redirectLocation, renderProps) => {
    if (redirectLocation) {
      res.redirect(redirectLocation.pathname + redirectLocation.search)
    } else if (error) {
      console.error('ROUTER ERROR:', pretty.render(error))
      res.status(500)
      hydrateOnClient()
    } else if (renderProps) {
      loadOnServer({...renderProps, store, helpers: {client}}).then(() => {
        const component = (
          <Provider store={store} key="provider">
            <ReduxAsyncConnect {...renderProps} />
          </Provider>
        )

        res.status(200)

        global.navigator = {userAgent: req.headers['user-agent']}

        res.send('<!doctype html>\n' +
          ReactDOM.renderToString(<Html assets={webpackIsomorphicTools.assets()} component={component} store={store}/>))
      })
    } else {
      res.status(404).send('Not found')
    }
  })
})

if (config.port) {
  server.listen(config.port, (err) => {
    if (err) {
      console.error(err)
    }
    console.info('----\n==> ✅  %s is running, talking to API server on %s.', config.app.title, config.apiPort)
    console.info('==> 💻  Open http://%s:%s in a browser to view the app.', config.host, config.port)
  })
} else {
  console.error('==>     ERROR: No PORT environment variable has been specified')
}
