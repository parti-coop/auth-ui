import users_test_client from './users-test-client'

export function clean_database() {
  return users_test_client.post('/v1/test/database/clean')
}
