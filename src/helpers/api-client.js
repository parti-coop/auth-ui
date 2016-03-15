import axios from 'axios'
import config from '../config'

export const api_client = {
  post(path, data, options = {}) {
    return rest_client.post(path, data, options)
  }
}

const rest_client = axios.create({
  baseURL: `http://${config.apiHost}:${config.apiPort}`
})
