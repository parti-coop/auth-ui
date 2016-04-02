import { handleActions } from 'redux-actions'

const SIGN_IN_REQUEST = 'auth-ui/sign-in/REQUEST'
const SIGN_IN_SUCCESS = 'auth-ui/sign-in/SUCCESS'
const SIGN_IN_FAIL = 'auth-ui/sign-in/FAIL'

const initial_state = {}

export const reducer = handleActions({
  SIGN_IN_REQUEST: (state, action) => ({
    state: SIGN_IN_REQUEST
  }),
  SIGN_IN_SUCCESS: (state, action) => ({
    state: SIGN_IN_SUCCESS,
    data: action.result
  }),
  SIGN_IN_FAIL: (state, action) => ({
    state: SIGN_IN_FAIL,
    error: action.error
  })
}, initial_state)

export const sign_in = ({ onSuccess, onError, ...data }) => ({
  types: [SIGN_IN_REQUEST, SIGN_IN_SUCCESS, SIGN_IN_FAIL],
  promise: client => {
    return client.post('/v1/sign-in', data).then(res => {
      if (res.status === 200 && res.headers.location) {
        if (onSuccess) {
          onSuccess(res)
        }
      } else {
        onError(res)
      }
    }).catch(err => {
      if (onError) {
        onError(err)
      }
    })
  }
})
