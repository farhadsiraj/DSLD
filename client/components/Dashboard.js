import React, { useState } from 'react';
import { Card, Button, Alert } from 'react-bootstrap';
import { useAuth } from './contexts/AuthContext';
import { Link, useHistory } from 'react-router-dom';
import GlobalStyles from '../GlobalStyles';
import 'bootstrap/dist/css/bootstrap.min.css';
import styled from 'styled-components';

export default function Dashboard() {
  const [error, setError] = useState('');
  const { currentUser, logout } = useAuth();
  const history = useHistory();

  async function handleLogout() {
    setError('');

    try {
      await logout();
      history.push('/login');
    } catch (error) {
      setError('Failed to log out');
    }
  }

  return (
    <Container>
      <GlobalStyles />
      <UserDataContainer></UserDataContainer>
      <AnalyticsContainer></AnalyticsContainer>
      <WorkoutContainer></WorkoutContainer>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Profile</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <strong>Email:</strong>
          {currentUser.email}
          <Link to="/update-profile" className="btn btn-primary w-100 mt-3">
            Update Profile
          </Link>
        </Card.Body>
      </Card>
      <div className="w-100 text=center mt-3">
        <Button variant="link" onClick={handleLogout}>
          Log Out
        </Button>
      </div>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  margin-top: 65px;
`;

const UserDataContainer = styled.div`
  display: flex;
  height: 30%;
  width: 100%;
  border: 1px solid blue;
`;

const AnalyticsContainer = styled.div`
  display: flex;
  border: #355c7d;
  border-width: 5px;
`;
const WorkoutContainer = styled.div`
  display: flex;
  height: 30%;
  width: 100%;
  border: 1px solid red;
`;
