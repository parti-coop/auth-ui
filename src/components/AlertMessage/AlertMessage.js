import React, { PropTypes } from 'react'
import { Alert } from 'react-bootstrap'

const AlertMessage = props =>
  <Alert bsStyle="warning">{props.message}</Alert>

AlertMessage.propTypes = {
  message: PropTypes.string.isRequired
}

export default AlertMessage
