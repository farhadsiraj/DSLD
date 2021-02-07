import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import { FormCheck } from './components/FormCheck'
import { Home } from './components/Home'
import { Login } from './components/LoginForm'

class Routes extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/formcheck" component={FormCheck} />
        <Route path="/login" component={Login} />
      </Switch>
    )
  }
}

export default Routes
