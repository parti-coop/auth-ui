import React from 'react'
import { IndexRoute, Route } from 'react-router'
import {
  App,
  Home,
  About,
  SignInView,
  SignUpView,
  SignUpConfirmationSentView,
  NotFound
} from 'containers'

export default () => {
  /**
   * Please keep routes in alphabetical order
   */
  return (
    <Route path="/" component={App}>
      { /* Home (main) route */ }
      <IndexRoute component={Home}/>
      { /* Routes */ }
      <Route path="authorizations" component={SignInView}/>
      <Route path="sign-up" component={SignUpView}/>
      <Route path="sign-up-confirmation-sent" component={SignUpConfirmationSentView}/>
      <Route path="about" component={About}/>

      { /* Catch all route */ }
      <Route path="*" component={NotFound} status={404} />
    </Route>
  )
}
