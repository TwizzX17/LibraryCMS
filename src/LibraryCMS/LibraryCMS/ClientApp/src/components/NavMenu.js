import React, { Component } from 'react';
import { Container, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import { TextField } from '@mui/material';
import Button from '@mui/material/Button';
import './../style/NavMenu.css';
import AuthService from './AuthService';

let Auth = new AuthService();

export class NavMenu extends Component {
  static displayName = NavMenu.name;

  constructor (props) {
    super(props);

    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.state = {
      collapsed: true,
      searchValue: ""
    };
  }

  toggleNavbar () {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }

  logout = () => {
    Auth.signOut();
    const [loggedIn, isAdmin] = this.props.checkUserLevel();
    this.props.authorizedStatusHandler(loggedIn, isAdmin);
  }

  handleInputChange = (e) => {
    this.setState({[e.target.id]: e.target.value});
  }

  handleInitiateSearch = (e) => {
    if(e.key === 'Enter' || e.key === undefined){
      this.props.history.push(`/Søgning/${this.state.searchValue}`);

    }
  }

  render () {

    /**
     * Can switch between different elements to render, based on the authentication status
     * 
     * This element can be rendered with 2 different types
     * - profile: display profile anchor element if logged in
     * - login: dependent on the loginstatus, render the fitting button
     * 
     * @param {object} props object with different props - variables such as authenticated and type has to be included
     * @returns Element to render in the navbar
     */
    function LoggedIn(props){
      let element;
      if(props.type === 'profil'){
        if(props.loggedIn){
          element = 
            <NavItem>
              <NavLink tag={Link} className="text-dark" to="/profil">Profile</NavLink>
            </NavItem>
          return element;
        } else {
          return null;
        }
      } else if(props.type === 'login'){
        if(!props.loggedIn){
          element =
            <NavItem>
              <NavLink tag={Link} className="text-dark" to="/login">Login</NavLink>
            </NavItem>
            return element
        } else {
          element = 
            <NavItem>
              <NavLink to="/" tag={Link} className="text-dark" onClick={props.logout}>Logout</NavLink>
            </NavItem>
            
          return element;
        }
      } else if(props.type === "create-account") {
        if(!props.loggedIn){
          element = 
            <NavItem>
              <NavLink to="/create-user" tag={Link} className="text-dark">Opret konto</NavLink>
            </NavItem>
            return element;
        } else {
          return null;
        }
        
      } else {
        return null;
      }
    }

    function Admin(props){
      if(props.loggedIn && props.isAdmin){
            const element = 
            <NavItem>
              <NavLink tag={Link} className="text-dark" to="/dashboard">Dashboard</NavLink>
            </NavItem>
            return element;
      } else {
        return null;
      }
    }

    return (
        <header className="navbar-header">
            <Container>
              <div className="navbar-container">
                <div className="nav-container">
                  <Link to="/">
                    <h4>Library CMS</h4>
                  </Link>
                </div>
                <div className="search_container">
                  <TextField id="searchValue" label="Søg..." variant="standard" 
                    value={this.state.searchValue} 
                    onChange={(event) => this.handleInputChange(event)}
                    onKeyUp={(event) => this.handleInitiateSearch(event)}
                  />
                  <Button id="layout-search-button" variant="contained" onClick={(event) => this.handleInitiateSearch(event)}>Søg</Button>
                </div>
                <ul className="nav-container navbar-nav flex-grow">
                  <Admin isAdmin={this.props.isAdmin} loggedIn={this.props.loggedIn}/>
                  <LoggedIn type="profil" loggedIn={this.props.loggedIn} />
                  <LoggedIn type="login" loggedIn={this.props.loggedIn} logout={this.logout} />
                  <LoggedIn type="create-account" loggedIn={this.props.loggedIn} logout={this.logout} />
                  {/*
                  <NavItem>
                    <NavLink tag={Link} className="text-dark" to="/test">Test</NavLink>
                  </NavItem>
                  */}
                </ul>
              </div>
            </Container>
      </header>
    );
  }
}
