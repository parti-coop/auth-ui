import { expect } from 'chai'

import { api_test_client } from '../api-client'

export function clean_database() {
  return api_test_client.post('/v1/test/database/clean').then(res => {
    api_test_client.token = null
  })
}
