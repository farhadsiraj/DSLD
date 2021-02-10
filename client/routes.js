import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './components/Home';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import FormCheck from './components/FormCheck';
import LoginForm from './components/LoginForm';
import PrivateRoute from './components/PrivateRoute';
import UpdateProfile from './components/UpdateProfile';
import ForgotPassword from './components/ForgotPassword';
import UserProfileForm from './components/UserProfileForm';
import ExerciseForm from './components/ExerciseForm';

class Routes extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/signup" component={Signup} />
        <Route exact path="/login" component={LoginForm} />
        <Route exact path="/forgot-password" component={ForgotPassword} />
        <PrivateRoute exact path="/formcheck" component={FormCheck} />
        <PrivateRoute path="/dashboard" component={Dashboard} />
        <PrivateRoute path="/update-profile" component={UpdateProfile} />
        <PrivateRoute path="/user-profile-form" component={UserProfileForm} />
        <PrivateRoute path="/exercise-form" component={ExerciseForm} />
      </Switch>
    );
  }
}

export default Routes;
