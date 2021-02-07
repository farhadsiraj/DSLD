import React, { Component } from 'react';
import { AuthProvider } from './components/contexts/AuthContext';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { FormCheck } from './components/FormCheck';
import { Home } from './components/Home';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import LoginForm from './components/LoginForm';
import PrivateRoute from './components/PrivateRoute';
import ForgotPassword from './components/ForgotPassword';
import UpdateProfile from './components/UpdateProfile';

class Routes extends Component {
  render() {
    return (
      <Router>
        <AuthProvider>
          <Switch>
            <PrivateRoute path="/dashboard" component={Dashboard} />
            <PrivateRoute path="/update-profile" component={UpdateProfile} />
            <Route path="/signup" component={Signup} />
            <Route exact path="/" component={Home} />
            <Route exact path="/formcheck" component={FormCheck} />
            <Route path="/login" component={LoginForm} />
            <Route path="/forgot-password" component={ForgotPassword} />
          </Switch>
        </AuthProvider>
      </Router>
    );
  }
}

export default Routes;
