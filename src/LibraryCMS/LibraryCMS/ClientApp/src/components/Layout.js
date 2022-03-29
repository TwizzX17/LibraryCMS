import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { NavMenu } from './NavMenu';
import { NavSideBar } from './NavSideBar';
import Footer from './Footer';

import "./../style/layout.css";

export class Layout extends Component {
  static displayName = Layout.name;

  render () {
    return (
      <div>
        <NavMenu
          history={this.props.history}
          loggedIn={this.props.loggedIn}
          isAdmin={this.props.isAdmin}
          authorizedStatusHandler={this.props.authorizedStatusHandler} 
          checkUserLevel={this.props.checkUserLevel}
        />
        <div className="content-container container">
          <NavSideBar />
          <Container>
            {this.props.children}
          </Container>
        </div>
        <Footer/>
      </div>
    );
  }
}
