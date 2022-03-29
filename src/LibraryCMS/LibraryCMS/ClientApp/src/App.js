import React, { Component, useState } from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import { Layout } from './components/Layout';
import AuthService from './components/AuthService';
import { Home } from './views/Home';
import Contact from './views/Contact';
import AboutUs from './views/AboutUs';
import { DisplayItem } from './views/DisplayItem';
import { Profile } from './views/Profile';
import Login from './views/Login';
import Logout from './views/Logout';
import CreateUser from './views/CreateUser';
import { SearchResults } from './views/SearchResults';
import { Category } from './views/Category';
import { Books } from './views/Books';

import { UserObject } from './views/UserObject';

import { Dashboard } from './views/Dashboard';
import { BookForm } from './views/BookForm';
import { GenreForm } from './views/GenreForm';
import DeleteObject from './components/DeleteObject';

import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

import { Test } from './views/test';

import './custom.css'


import history from "./components/History";


let Auth = new AuthService();
export default class App extends Component {
  static displayName = App.name;
  constructor() {
    super();
    this.state = {
      loggedIn: false,
      isAdmin: false
    }
  }

  componentWillMount() {
    const [loggedIn, isAdmin] = this.checkUserLevel();
    this.setState({ loggedIn: loggedIn, isAdmin: isAdmin })
    console.log(history)
  };

  authorizedStatusHandler = (loggedIn, isAdmin) => {
    this.setState({ loggedIn: loggedIn, isAdmin: isAdmin })
  }

  checkUserLevel = () => {
    return [Auth.loggedIn(), Auth.checkIsAdmin()]
  }

  render() {
    return (
      <Router history={history}>
        <Layout
          history={history}
          loggedIn={this.state.loggedIn}
          isAdmin={this.state.isAdmin}
          authorizedStatusHandler={this.authorizedStatusHandler}
          checkUserLevel={this.checkUserLevel}
        >
          <Switch>
            <Route exact path='/' component={Home} />
            <Route exact path='/contact-us' component={Contact} />
            <Route exact path='/about-us' component={AboutUs} />
            <Route exact path='/Søgning/:title' render={
              (props) => <SearchResults {...props} Title="Søgeresultater" />
            } />
            <Route exact path='/Kategori/:genre' component={Category} />
            <Route exact path='/Bøger/:id' render={
              (props) => <DisplayItem {...props} loggedIn={this.state.loggedIn} />
            } />
            <Route exact path='/Bøger' component={Books} />
            <PrivateRoute
              loggedIn={this.state.loggedIn}
              isAdmin={this.state.isAdmin}
              exact path='/Profil'
            >
              <Profile />
            </PrivateRoute>

            <AdminRoute
              loggedIn={this.state.loggedIn}
              isAdmin={this.state.isAdmin}
              path="/dashboard"
            >
              <Dashboard path="/dashboard" history={history} />
              <UserObject path="/dashboard/users/toadmin" history={history} title="Bruger til administrator" type="toAdmin" />
              <UserObject path="/dashboard/users/fromadmin" history={history} title="Administrator til bruger" type="fromAdmin" />
              <UserObject path="/dashboard/users/unconfirm" history={history} title="Afbekræft bruger" type="unconfirm" />
              <UserObject path="/dashboard/users/confirm" history={history} title="Bekræft bruger" type="confirm" />
              <UserObject path="/dashboard/users/delete" history={history} title="Slet Bruger" type="delete" endpointList="GetUsers" endpointAction="DeleteUser" />

              <BookForm path="/dashboard/books/create" history={history} type="create" />
              <BookForm path="/dashboard/books/edit" history={history} type="edit" />
              <DeleteObject path="/dashboard/books/delete" history={history} title="Slet Bog" type="book" endpointList="GetAllBooks" endpointAction="deletebook" renderKey="Title" />

              <GenreForm path="/dashboard/genres/create" history={history} type="create" />
              <GenreForm path="/dashboard/genres/edit" history={history} type="edit" />
              <DeleteObject path="/dashboard/genres/delete" history={history} title="Slet Genre" type="genre" endpointList="GetGenres" endpointAction="DeleteGenre" renderKey="Name" />
            </AdminRoute>

            <Route exact path='/login'>
              <Login
                authorizedStatusHandler={this.authorizedStatusHandler}
                checkUserLevel={this.checkUserLevel} />
            </Route>

            <Route exact path='/logout'>
              <Logout
                authorizedStatusHandler={this.authorizedStatusHandler}
                checkUserLevel={this.checkUserLevel} />
            </Route>
            <Route exact path='/create-user'>
              <CreateUser
                authorizedStatusHandler={this.authorizedStatusHandler}
                checkUserLevel={this.checkUserLevel} />
            </Route>
            <Route exact path='/test' component={Test} />
            <Redirect to="/" />
          </Switch>
        </Layout>
      </Router>
    );
  }
}
