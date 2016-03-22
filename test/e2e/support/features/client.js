import { api_client } from '../../../../src/helpers/api-client'

export function client_exists({token = null, ...attrs}) {
  const data = Object.assign({ name: 'default client name' }, attrs)
  return api_client.post('/v1/clients', data, { token }).then(res => {
    return res.data
  })
}
