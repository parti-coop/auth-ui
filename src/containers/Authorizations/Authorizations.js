import R from 'ramda'
import React, { PropTypes } from 'react'
import qs from 'qs'
import { Col, Row } from 'react-bootstrap'
import { actions as notifActions } from 're-notif'
import { connect } from 'react-redux'

import { SignInForm } from '../../components'
import { sign_in } from '../../redux/modules/authorizations'

const onSignInFormSubmit = fields => dispatch => {
  const data = R.mergeAll([
    { response_type: 'code' },
    qs.parse(window.location.search.slice(1)),
    R.pick(['email', 'password'], fields)
  ])
  const sign_in_action = sign_in({
    ...data,
    onSuccess: res => { window.location.href = res.headers.location },
    onError: err => {
      const errors = R.pathOr([`${err.status} ${err.statusText}`], ['data', 'errors'], err)
      const messages = errors.map(item => R.propOr(item, 'full_messages', item))
      messages.forEach(message => {
        dispatch(notifActions.notifSend({ message, kind: 'warning', dismissAfter: 7000 }))
      })
    }
  })
  dispatch(sign_in_action)
}

const mapStateToProps = () => ({})

const mapDispatchToProps = {
  onSignInFormSubmit
}

const Authorizations = props =>
  <Row>
    <Col md={4} mdOffset={4}>
      <SignInForm onSubmit={props.onSignInFormSubmit}/>
    </Col>
  </Row>

Authorizations.propTypes = {
  onSignInFormSubmit: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(Authorizations)
