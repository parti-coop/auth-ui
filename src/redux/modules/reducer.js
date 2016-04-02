import { combineReducers } from 'redux'
import { routeReducer } from 'react-router-redux'
import { reducer as reduxAsyncConnect } from 'redux-async-connect'
import { reducer as notifReducer } from 're-notif'
import { reducer as form } from 'redux-form'

import { reducer as sign_in } from './authorizations'

export default combineReducers({
  form,
  notifs: notifReducer,
  reduxAsyncConnect,
  routing: routeReducer,
  sign_in
})
