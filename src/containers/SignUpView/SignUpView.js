import React, { PropTypes } from 'react'
import R from 'ramda'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { Col, Row } from 'react-bootstrap'

import SignUpForm from '../../components/SignUpForm/SignUpForm'
import { api_client } from '../../helpers/api-client'

const onSignUpSubmit = fields => dispatch => {
  const omitConfirmation = (v, k) => k !== 'passwordConfirmation'
  const data = R.pickBy(omitConfirmation, fields)
  return api_client.post('/v1/users', data)
  .then(_res => {
    return dispatch(push('/sign-up-confirmation-sent'))
  })
  .catch(err => {
    console.log(err)
  })
}

const mapStateToProps = (_state) => ({
})

const mapDispatchToProps = {
  onSignUpSubmit
}

const SignUpView = (props) =>
  <Row>
    <Col md={4} mdOffset={4}>
      <SignUpForm onSubmit={props.onSignUpSubmit}/>
    </Col>
  </Row>

SignUpView.propTypes = {
  onSignUpSubmit: PropTypes.func.isRequired
}
// export default SignUpView
export default connect(mapStateToProps, mapDispatchToProps)(SignUpView)
