import factory from 'factory-girl'
import { api_client } from '../../../../src/helpers/api-client'

const Client = () => {}

export function client_exists({token = null, ...attrs}) {
  const data = Object.assign({ name: 'default client name' }, attrs)
  return api_client.post('/v1/clients', data, { token }).then(res => {
    return res.data
  })
}

export function registered_client_exist(attrs = {}) {
  return new Promise(resolve => {
    factory.build('client', attrs, (err, client) => {
      resolve(client)
    })
  })
}

factory.define('client', Client, {
  client_id: 'client_id',
  redirect_uris: () => {
    return [ 'http://redirect.uri.com' ]
  }
})
