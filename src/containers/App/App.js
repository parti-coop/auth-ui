import Helmet from 'react-helmet'
import React, { Component, PropTypes } from 'react'
import { Grid, Nav, Navbar, NavItem } from 'react-bootstrap'
import { IndexLink } from 'react-router'
import { LinkContainer } from 'react-router-bootstrap'
import { Notifs } from 're-notif'

import config from '../../config'
import { AlertMessage } from '../../components'

export default class App extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
  };

  render() {
    const styles = require('./App.scss')

    return (
      <Grid className={styles.app}>
        <Helmet {...config.app.head}/>
        <Navbar>
          <Navbar.Header>
            <Navbar.Brand>
              <IndexLink to="/" activeStyle={{color: '#33e0ff'}}>
                <div className={styles.brand}/>
                <span>{config.app.title}</span>
              </IndexLink>
            </Navbar.Brand>
            <Navbar.Toggle/>
          </Navbar.Header>

          <Navbar.Collapse eventKey={0}>
            <Nav navbar>
              <LinkContainer to="/authorizations">
                <NavItem eventKey={1}>Authorizations</NavItem>
              </LinkContainer>
              <LinkContainer to="/sign-up">
                <NavItem eventKey={2}>Sign Up</NavItem>
              </LinkContainer>
              <LinkContainer to="/about">
                <NavItem eventKey={3}>About Us</NavItem>
              </LinkContainer>
            </Nav>
            <Nav navbar pullRight>
              <NavItem eventKey={1} target="_blank" title="View on Github" href="https://github.com/erikras/react-redux-universal-hot-example">
                <i className="fa fa-github"/>
              </NavItem>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <Notifs CustomComponent={AlertMessage}/>
        <div className={styles.appContent}>
          {this.props.children}
        </div>
      </Grid>
    )
  }
}
