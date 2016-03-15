import normalize_url from 'normalize-url'
import config from '../config'

export function auth_ui_url(path) {
  return normalize_url(`http://${config.host}:${config.port}${path}`)
}

export function auth_api_url(path) {
  return normalize_url(`http://${config.apiHost}:${config.apiPort}${path}`)
}

export function authorizations_url() {
  return auth_ui_url('/authorizations')
}
