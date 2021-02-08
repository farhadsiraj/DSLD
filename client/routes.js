import React, { Component } from 'react'
import { AuthProvider } from './components/contexts/AuthContext'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Home from './components/Home'
import Signup from './components/Signup'
import Dashboard from './components/Dashboard'
import FormCheck from './components/FormCheck'
import LoginForm from './components/LoginForm'
import PrivateRoute from './components/PrivateRoute'
import UpdateProfile from './components/UpdateProfile'
import ForgotPassword from './components/ForgotPassword'

class Routes extends Component {
  render() {
    return (
      <Router>
        <AuthProvider>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/signup" component={Signup} />
            <Route exact path="/formcheck" component={FormCheck} />
            <Route exact path="/login" component={LoginForm} />
            <Route exact path="/forgot-password" component={ForgotPassword} />
            <PrivateRoute exact path="/dashboard" component={Dashboard} />
            <PrivateRoute
              exactpath="/update-profile"
              component={UpdateProfile}
            />
          </Switch>
        </AuthProvider>
      </Router>
    )
  }
}

export default Routes
