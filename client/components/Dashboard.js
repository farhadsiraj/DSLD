import React, { useState } from 'react';
import { Card, Button, Alert } from 'react-bootstrap';
import { useAuth } from './contexts/AuthContext';
import { Link, useHistory } from 'react-router-dom';
import GlobalStyles from '../GlobalStyles';
import 'bootstrap/dist/css/bootstrap.min.css';
import styled from 'styled-components';
import app from '../../firebase';
import gym from '../../public/assets/images/gym.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

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
          <ProfilePicture src={gym} />
          <UserInfo>
            <div>Active Streak</div>
            <div>Lifetime Reps</div>
            <div>Weight</div>
          </UserInfo>
        </UserDataContainer>
        <AnalyticsContainer>
          <FALargeIcon>
            <FontAwesomeIcon
              icon={faPlus}
              style={{ fontSize: '1.8rem', color: '#EE4A40' }}
            />
          </FALargeIcon>
        </AnalyticsContainer>
        <WorkoutContainer>
          <Workouts>
            <FAMobileIcon style={{ width: '100%' }}>
              <FontAwesomeIcon
                icon={faPlus}
                style={{ fontSize: '1.8rem', color: '#EE4A40' }}
              />
            </FAMobileIcon>
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
        <AccountSettingsContainer>
          <CurrentSettings>
            <h2 style={{ color: 'white' }}>Account Settings</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Row>
              <SettingsTitle>Email: </SettingsTitle>
              <SettingsText> {currentUser.email}</SettingsText>
            </Row>
            <Row>
              <SettingsTitle>Email: </SettingsTitle>
              <SettingsText>{currentUser.email}</SettingsText>
            </Row>
            <Row>
              <SettingsTitle>Email: </SettingsTitle>
              <SettingsText>{currentUser.email}</SettingsText>
            </Row>
            <Row>
              <SettingsTitle>Email: </SettingsTitle>
              <SettingsText>{currentUser.email}</SettingsText>
            </Row>
          </CurrentSettings>
          <Link to="/update-profile">
            <StyledButton>Update Profile</StyledButton>
          </Link>
          <StyledButton
            style={{ backgroundColor: 'seagreen' }}
            onClick={handleLogout}
          >
            Log Out
          </StyledButton>
        </AccountSettingsContainer>
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
`;

const ProfilePicture = styled.img`
  width: 8rem;
  height: 8rem;
  border-radius: 50%;
  padding: 0rem;
  border: 3px;
  background-color: #355c7d;
  border: 3px dotted #355c7d;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center
  width: 11rem;
  height: 10rem;
  background-color: #355c7d;
  border-radius: 2rem;
  color: white;
  justify-content: center;
  padding-left: 1rem;
`;

const AnalyticsContainer = styled.div`
  display: none;
  @media only screen and (min-width: 960px) {
    display: flex;
    height: 10vh;
    width: 100%;
    border-radius: 5px;
    justify-content: center;
    align-items: center;
    margin-left: 1.6rem;
  }
`;

const WorkoutContainer = styled.div`
  display: flex;
  width: 100%;
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
    height: 20rem;
    flex-direction: row;
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
  padding: 1rem 0 1rem 0;
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
  margin: 0.5rem;
`;

const AccountSettingsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  justify-content: center;
  background-color: #f9a26c;
  margin-top: 3rem;
  padding-top: 2rem;
  padding-bottom: 2rem;
`;

const CurrentSettings = styled.div`
  display: flex;
  flex-direction: column;
`;

const SettingsTitle = styled.h3`
  color: white;
  font-size: 1.2rem;
`;
const SettingsText = styled.h3`
  color: white;
  font-size: 1rem;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
`;

const FAMobileIcon = styled.div`
  width: 100%;
  @media only screen and (min-width: 960px) {
    display: none;
  }
`;
const FALargeIcon = styled.div`
  width: 90%;
`;
