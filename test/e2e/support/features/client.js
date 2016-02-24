import factory from 'factory-girl'

const Client = () => {}

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
