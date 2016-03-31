import normalize_url from 'normalize-url'
import config from '../config'

export function auth_ui_url(path = '') {
  return normalize_url(`http://${config.host}:${config.port}${path}`)
}

export function auth_api_url(path = '') {
  return normalize_url(`http://${config.apiHost}:${config.apiPort}${path}`)
}

export function users_api_url(path = '') {
  return normalize_url(`http://${users_api_host()}:${users_api_port()}${path}`)
}

export function users_api_host() {
  return process.env.USERS_API_HOST || 'users-api'
}

export function users_api_port() {
  let matches = /^\d+$/.exec(process.env.USERS_API_PORT)
  if (matches) {
    return parseInt(matches[0], 10)
  }
  matches = /^tcp:\/\/.+:(\d+)$/.exec(process.env.USERS_API_PORT)
  if (matches) {
    return parseInt(matches[1], 10)
  }
  return 3030
}
