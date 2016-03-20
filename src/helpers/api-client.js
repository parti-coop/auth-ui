import R from 'ramda'
import axios from 'axios'
import { Maybe } from 'ramda-fantasy'

import config from '../config'

const lookup = R.curry((k, obj) => k in obj ? Maybe.Just(obj[k]) : Maybe.Nothing())

export const api_client = {
  post(path, data, options = {}) {
    const token_header = Maybe.maybe(
      {},
      t => ({'Authorization': `Bearer ${t}`}),
      lookup('token', options)
    )
    options.headers = R.merge(R.propOr({}, 'headers', options), token_header)
    return rest_client.post(path, data, options)
  }
}

const rest_client = axios.create({
  baseURL: `http://${config.apiHost}:${config.apiPort}`
})
