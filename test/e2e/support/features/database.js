import { api_test_client } from '../api-test-client'

export function clean_database() {
  return api_test_client.post('/v1/test/database/clean').then(() => {
    api_test_client.token = null
  })
}
