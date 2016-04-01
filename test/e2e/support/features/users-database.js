import users_test_client from './users-test-client'
import { clear_token_cache } from '../../../../src/helpers/auth-client'

export function clean_database() {
  return users_test_client.post('/v1/test/database/clean').then(() => {
    clear_token_cache()
  })
}
