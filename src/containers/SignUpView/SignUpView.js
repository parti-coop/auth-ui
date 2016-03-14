import React from 'react'
import { Col, Row } from 'react-bootstrap'

import SignUpForm from '../../components/SignUpForm/SignUpForm'

const SignUpView = () =>
  <Row>
    <Col md={4} mdOffset={4}>
      <SignUpForm />
    </Col>
  </Row>

export default SignUpView

