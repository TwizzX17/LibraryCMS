import React from 'react';
import { Route, Redirect } from 'react-router';

function AdminRoute ({ children, ...rest }) {
  return (
    <Route {...rest} render={() => {
      if(rest.loggedIn && rest.isAdmin){
        for(const element of children){
          //Render element if path and location matches
          if(element.props.path === rest.location.pathname){
            return element;
          }
        }

      } else {
        return <Redirect to='/login' />
      }
    }} />
  )
  }
  export default AdminRoute;