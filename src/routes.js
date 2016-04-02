import React from 'react'
import {IndexRoute, Route} from 'react-router'
import {
    About,
    App,
    Authorizations,
    Home,
    NotFound,
  } from 'containers'

export default (store) => {
  /**
   * Please keep routes in alphabetical order
   */
  return (
    <Route path="/" component={App}>
      { /* Home (main) route */ }
      <IndexRoute component={Home}/>

      { /* Routes */ }
      <Route path="authorizations" component={Authorizations}/>
      <Route path="about" component={About}/>

      { /* Catch all route */ }
      <Route path="*" component={NotFound} status={404} />
    </Route>
  )
}
