import R from 'ramda'
import React, { PropTypes } from 'react'
import qs from 'qs'
import { Col, Row } from 'react-bootstrap'
import { actions as notifActions } from 're-notif'
import { connect } from 'react-redux'

import SignInForm from '../../components/SignInForm/SignInForm'
import config from '../../config'
import { api_client } from '../../helpers/api-client'

const onSignInSubmit = fields => dispatch => {
  return api_client.post('/v1/users/sign_in', fields).then(res => {
    const auth_token = R.pick(['access-token', 'client', 'uid'], res.headers)
    const options = {
      baseURL: `http://${config.host}:${config.port}`,
      headers: auth_token,
      transformRequest: [ qs.stringify ]
    }
    const data = R.merge({ response_type: 'code' }, qs.parse(window.location.search.slice(1)))
    return api_client.post('/v1/authorizations', data, options)
  }).then(res => {
    window.location.href = res.headers.location
  }).catch(err => {
    const messages = R.pathOr([err.statusText], ['data', 'errors', 'full_messages'], err)
    messages.forEach(message => {
      dispatch(notifActions.notifSend({ message, kind: 'warning', dismissAfter: 5000 }))
    })
  })
}

const mapStateToProps = (_state) => ({
})

const mapDispatchToProps = {
  onSignInSubmit
}

const SignInView = (props) =>
  <Row>
    <Col md={4} mdOffset={4}>
      <SignInForm onSubmit={props.onSignInSubmit}/>
    </Col>
  </Row>

SignInView.propTypes = {
  onSignInSubmit: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(SignInView)
