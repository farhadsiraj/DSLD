import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import { Home } from './components/Home'
import { FormCheck } from './components/FormCheck'
import NavBar from './components/NavBar'

ReactDOM.render(
  <Router>
    <NavBar />
    <FormCheck />
  </Router>,
  document.getElementById('app')
)
