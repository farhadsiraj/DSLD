import React, { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import { Link, useHistory } from 'react-router-dom';
import app from '../../firebase';
import styled from 'styled-components';
import GlobalStyles from '../GlobalStyles';
import { Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import gym from '../../public/assets/images/gym.jpg';

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
        <ColumnContainer>
          <UserDataContainer>
            <ProfilePicture src={gym} />
            <UserInfo>
              <Flex>
                <DataBox>
                  <div>Total Reps</div>
                  <div>Total Reps</div>
                  <div>Total Reps</div>
                  <div>Total Reps</div>
                </DataBox>
                <DataBox>
                  <div>Total Reps</div>
                  <div>Total Reps</div>
                  <div>Total Reps</div>
                  <div>Total Reps</div>
                </DataBox>
                <DataBox>
                  <div>Total Reps</div>
                  <div>Total Reps</div>
                  <div>Total Reps</div>
                  <div>Total Reps</div>
                </DataBox>
              </Flex>
            </UserInfo>
          </UserDataContainer>
          <AnalyticsContainer>
            <FALargeIcon>
              <FontAwesomeIcon
                icon={faPlus}
                style={{ fontSize: '1.8rem', color: '#EE4A40' }}
                onClick={() => history.push('/exercise-form')}
              />
            </FALargeIcon>
          </AnalyticsContainer>
          <WorkoutContainer>
            <Workouts>
              <FAMobileIcon style={{ width: '100%' }}>
                <FontAwesomeIcon
                  icon={faPlus}
                  style={{ fontSize: '1.8rem', color: '#EE4A40' }}
                  onClick={() => history.push('/exercise-form')}
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
        </ColumnContainer>
        <AccountSettingsContainer>
          <CurrentSettings>
            <h2 style={{ color: 'white' }}>Account Settings</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Row>
              <SettingsTitle>Email: </SettingsTitle>
              <SettingsText> {currentUser.email}</SettingsText>
            </Row>
            <Row>
              <SettingsTitle>Name: </SettingsTitle>
              <SettingsText>{currentUser.email}</SettingsText>
            </Row>
            <Row>
              <SettingsTitle>Age: </SettingsTitle>
              <SettingsText>{currentUser.email}</SettingsText>
            </Row>
            <Row>
              <SettingsTitle>Weight: </SettingsTitle>
              <SettingsText>{currentUser.email}</SettingsText>
            </Row>
            <Row>
              <SettingsTitle>Sex: </SettingsTitle>
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
  width: 100%;
  height: 100%;
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

const ColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1.5rem 1.5rem;
`;

const UserDataContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  height: 35vh;
  width: 100%;
  padding: 1rem;
  @media only screen and (min-width: 960px) {
    flex-direction: row;
    justify-content: space-between;
    padding: 0 1.5rem;
  }
`;

const ProfilePicture = styled.img`
  width: 10rem;
  height: 10rem;
  border-radius: 50%;
  border: 3px;
  border: 5px solid #f8b195;
  position: relative;
  overflow: hidden;
  margin: 1rem;
  @media only screen and (min-width: 960px) {
    width: 15rem;
    height: 15rem;
    margin-left: 6rem;
  }
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 90%;
  height: 90%;
  background-color: #355c7d;
  border-radius: 2rem;
  color: white;
  justify-content: center;
  @media only screen and (min-width: 960px) {
    width: 70%;
    height: 100%;
  }
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
  }
`;

const WorkoutContainer = styled.div`
  width: 100%;
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
    width: 100%;
    justify-content: space-between;
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
  margin: 0;
  width: 100%;
  @media only screen and (min-width: 960px) {
    display: none;
  }
`;
const FALargeIcon = styled.div`
  width: 90%;
`;

const DataBox = styled.div`
  flex: 1;
  margin: 1rem;
  justify-content: center;
`;

const Flex = styled.div`
  display: flex;
`;
