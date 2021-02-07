import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// create a wrapper for our current route
// {component: Component is the component we want to render}
export default function PrivateRoute({ component: Component, ...rest }) {
  const { currentUser } = useAuth();

  /* {...rest} = giving it the rest of the props as if it was normally being passed a route */

  return (
    <Route
      {...rest}
      render={(props) => {
        // if we have a current user, render out the component we were passed, otherwise redirect user to login
        // we render the component and pass in these props
        return currentUser ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        );
      }}
    ></Route>
  );
}
