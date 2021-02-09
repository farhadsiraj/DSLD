import React, { Component } from 'react'
import { AuthProvider } from './components/contexts/AuthContext'
import { Route, Switch } from 'react-router-dom'
import Home from './components/Home'
import Signup from './components/Signup'
import Dashboard from './components/Dashboard'
import FormCheck from './components/FormCheck'
import LoginForm from './components/LoginForm'
import PrivateRoute from './components/PrivateRoute'
import UpdateProfile from './components/UpdateProfile'
import ForgotPassword from './components/ForgotPassword'
import UserProfileForm from './components/UserProfileForm'

class Routes extends Component {
  render() {
    return (
      <AuthProvider>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/signup" component={Signup} />
          <Route exact path="/login" component={LoginForm} />
          <Route exact path="/formcheck" component={FormCheck} />
          <Route exact path="/forgot-password" component={ForgotPassword} />
          <PrivateRoute path="/dashboard" component={Dashboard} />
          <PrivateRoute path="/update-profile" component={UpdateProfile} />
          <PrivateRoute path="/user-profile-form" component={UserProfileForm} />
        </Switch>
      </AuthProvider>
    )
  }
}

export default Routes
