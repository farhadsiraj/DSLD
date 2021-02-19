import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import NavBar from './components/NavBar';
import Routes from './routes';
import { AuthProvider } from './components/contexts/AuthContext';

ReactDOM.render(
  <AuthProvider>
    <Router>
      <NavBar />
      <Routes />
    </Router>
  </AuthProvider>,
  document.getElementById('app')
);
