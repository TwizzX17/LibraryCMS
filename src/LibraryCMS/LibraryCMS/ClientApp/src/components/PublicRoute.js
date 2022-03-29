import React from 'react';
import { Route, Redirect } from 'react-router';

function PublicRoute ({ children, ...rest }) {
  return (
    <Route {...rest} render={() => {
        for(const element of children){
          //Render element if path and location matches
          if(element.props.path === rest.location.pathname){
            return element;
          }
        }
    }} />
  )
  }
  export default PublicRoute;