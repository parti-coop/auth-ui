import React from 'react'
import { Col, Row } from 'react-bootstrap'

import SignInForm from '../../components/SignInForm/SignInForm'

const SignInView = () =>
  <Row>
    <Col md={4} mdOffset={4}>
      <SignInForm />
    </Col>
  </Row>

export default SignInView
