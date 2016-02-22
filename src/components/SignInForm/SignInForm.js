import React, { PropTypes } from 'react'
import { reduxForm } from 'redux-form'
import { ButtonInput, Input, Panel } from 'react-bootstrap'

export const SignInFormClassName = 'sign-in-form'

class SignInForm extends React.Component {
  static propTypes = {
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired
  };

  render() {
    const {
      fields: {email, password},
      handleSubmit
    } = this.props

    return (
      <Panel header="Sign In" bsStyle="info">
        <form className={SignInFormClassName} onSubmit={handleSubmit}>
          <Input type="email" label="Email" placeholder="Enter email..." {...email} />
          <Input type="password" label="Password" placeholder="Enter password..." {...password} />
          <ButtonInput type="submit" value="Sign In" bsStyle="primary" />
        </form>
      </Panel>
    )
  }
}

const SignInReduxForm = reduxForm({
  form: 'signIn',
  fields: ['email', 'password']
})(SignInForm)

export default SignInReduxForm
