import { CREATE_CLIENT } from '../../../../src/models/scope'
import { access_token_is_granted } from './token'
import { post_with_token } from '../../../../src/helpers/auth-client'
import { user_account_exists } from './user-account'

export function client_exists({ account = {}, scopes = {}, ...rest } = {}) {
  return user_account_exists(account).then(user_account => {
    return access_token_is_granted({ account: user_account, scopes: [ CREATE_CLIENT ] })
  }).then(token => {
    const client_attrs = Object.assign(
      {
        name: 'default client name',
        redirect_uris: ['http://redirect.url']
      },
      { scopes, ...rest }
    )
    return post_with_token(token, '/v1/clients', client_attrs)
  }).then(res => {
    return res.data
  })
}
