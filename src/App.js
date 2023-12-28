import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Login from './pages/Login';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <div className="mh-100vh">
      <BrowserRouter>
          <Switch>
            <Route path="/sign-in" component={Login} />
            <PrivateRoute path="/" component={Dashboard} />
          </Switch>
      </BrowserRouter>
    </div>    
  );
}

export default App;
