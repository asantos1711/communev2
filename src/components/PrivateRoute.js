import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { authContext } from '../context/AuthContext';

function PrivateRoute({component: Component, ...rest}){
    const { auth } = useContext(authContext);
    const { loading } = auth;

    if (loading) {
        return (
          <Route
            {...rest}
            render={() => {
              return <p>Loading...</p>;
            }}
          />
        );
      }


    return (
        <Route
          {...rest}
          render={(routeProps) => (
            auth.data ? <Component {...routeProps} /> : <Redirect to="/sign-in" />
          )}
        />
    
      );
}

export default PrivateRoute