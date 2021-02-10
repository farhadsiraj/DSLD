import React, { useState } from 'react';
import { Card, Button, Alert } from 'react-bootstrap';
import { useAuth } from './contexts/AuthContext';
import { Link, useHistory } from 'react-router-dom';
import GlobalStyles from '../GlobalStyles';
import 'bootstrap/dist/css/bootstrap.min.css';
import styled from 'styled-components';
import app from '../../firebase';

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
      <GradientContainer>
        <GlobalStyles />
        <UserDataContainer>
          <ProfilePicture />
          <UserInfo>
            <div>Active Streak</div>
            <div>Lifetime Reps</div>
            <div>Weight</div>
          </UserInfo>
        </UserDataContainer>
        <WorkoutContainer>
          <Workouts>
            <WorkoutBox>
              <CustomWorkoutTitle>Workout One</CustomWorkoutTitle>
              <CustomWorkoutType>Squats</CustomWorkoutType>
              <CustomWorkoutDetail>Reps: 10</CustomWorkoutDetail>
              <CustomWorkoutDetail>Sets: 3</CustomWorkoutDetail>
              <StyledButton>Start</StyledButton>
            </WorkoutBox>
            <WorkoutBox>
              <CustomWorkoutTitle>Workout One</CustomWorkoutTitle>
              <CustomWorkoutType>Squats</CustomWorkoutType>
              <CustomWorkoutDetail>Reps: 10</CustomWorkoutDetail>
              <CustomWorkoutDetail>Sets: 3</CustomWorkoutDetail>
              <StyledButton>Start</StyledButton>
            </WorkoutBox>
            <WorkoutBox>
              <CustomWorkoutTitle>Workout One</CustomWorkoutTitle>
              <CustomWorkoutType>Squats</CustomWorkoutType>
              <CustomWorkoutDetail>Reps: 10</CustomWorkoutDetail>
              <CustomWorkoutDetail>Sets: 3</CustomWorkoutDetail>
              <StyledButton>Start</StyledButton>
            </WorkoutBox>
          </Workouts>
        </WorkoutContainer>
        <Card>
          <Card.Body>
            <h2 className="text-center mb-4">Account Settings</h2>
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
      </GradientContainer>
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

const GradientContainer = styled.div`
  &:after {
    background: rgb(242, 102, 39);
    background: linear-gradient(
      -190deg,
      rgba(242, 102, 39, 1) 0%,
      rgba(255, 255, 255, 1) 75%,
      rgba(255, 255, 255, 1) 100%
    );
    content: ' ';
    display: block;
    position: absolute;
    top: -20px;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
  }
`;

const UserDataContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  height: 35vh;
  width: 100%;
  padding: 1rem;
  border: 1px solid blue;
`;

const ProfilePicture = styled.div`
  width: 7rem;
  height: 7rem;
  border-radius: 50%;
  padding: 1rem;
  background-color: #355c7d;
  border: 1px solid blue;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 11rem;
  height: 10rem;
  background-color: #355c7d;
  border-radius: 2rem;
  color: white;
  justify-content: center;
  border: 1px solid blue;
`;

const AnalyticsContainer = styled.div`
  display: flex;
  border: 5px solid #355c7d;
  height: 10vh;
  width: 100%;
  border-radius: 5px;
  justify-content: space-around;
  align-items: center;
`;

const WorkoutContainer = styled.div`
  display: flex;
  width: 100%;
  border: 1px solid red;
  justify-content: center;
`;

const Workouts = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 90%;
  height: 50rem;
  @media only screen and (min-width: 960px) {
    flex-direction: row;
    width: 92%;
  }
`;

const WorkoutBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: #355c7d;
  margin: 1rem;
  border-radius: 2rem;
  justify-content: center;
  align-items: center;
`;

const CustomWorkoutTitle = styled.h1`
  color: white;
  font-size: 2rem;
`;
const CustomWorkoutType = styled.h2`
  color: white;
  font-size: 1.2rem;
`;
const CustomWorkoutDetail = styled.h3`
  color: white;
  font-size: 1rem;
`;

const StyledButton = styled.button`
  background-color: #f67280;
  color: white;
  padding: 1rem;
  width: 10rem;
  border-radius: 0.8rem;
  border-style: none;
`;
