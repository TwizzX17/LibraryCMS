import React from 'react';
import { Route, Redirect } from 'react-router';

function PrivateRoute ({ children, ...rest }) {
    return (
      <Route {...rest} render={() => {
        return rest.loggedIn
          ? children
          : <Redirect to='/login' />
      }} />
    )
  }
  export default PrivateRoute;