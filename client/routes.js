import React, { Component } from 'react';
import { withRouter, Route, Switch } from 'react-router-dom';
import { FormCheck } from './components/FormCheck';
import { Home } from './components/Home';

class Routes extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/formcheck" component={FormCheck} />
      </Switch>
    );
  }
}

export default Routes;
