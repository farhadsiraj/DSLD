import React, { useState, useEffect } from 'react';
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
  const [user, setUser] = useState(null);
  const [workoutHistory, setWorkoutHistory] = useState([]);

  async function handleLogout() {
    setError('');

    try {
      await logout();
      history.push('/login');
    } catch (error) {
      setError('Failed to log out');
    }
  }

  useEffect(async () => {
    (async () => {
      const userRef = app.firestore().collection('users').doc(currentUser.uid);
      const userDoc = await userRef.get();
      if (!userDoc.exists) {
        console.log('No user data is available.');
        setUser('N/A');
      } else {
        userDoc.data();
        setUser(userDoc.data());
      }

      let pastWorkouts = [];
      const workoutHistoryRef = app
        .firestore()
        .collection('users')
        .doc(currentUser.uid)
        .collection('workoutHistory');

      const historySnapshot = await workoutHistoryRef.get();

      historySnapshot.forEach((doc) => {
        if (!doc.data()) {
          setError('Username not available');
          throw new Error('Username not available');
        } else {
          pastWorkouts.push(doc.data());
        }
      });
      setWorkoutHistory(pastWorkouts);
    })();
  }, []);

  console.log('currentUser', user);
  console.log('workoutHistory', workoutHistory);

  return (
    <div>
      {user && workoutHistory.length ? (
        <Container>
          <GradientContainer>
            <GlobalStyles />
            <ColumnContainer>
              <UserDataContainer>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <ProfilePicture src={user.imageUrl} />
                  <UserName>{user.name}</UserName>
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    height: '100%',
                  }}
                >
                  {/* <Link to="/exercise-form" className="link-reset hover-reset">
                    <StyledButton
                      style={{
                        backgroundColor: 'seagreen',
                        padding: '1rem',
                      }}
                    >
                      Start workout
                    </StyledButton>
                  </Link> */}
                </div>
                <UserInfo>
                  <Flex style={{ width: '90%' }}>
                    <DataBox>
                      <div>Active Streak:</div>
                      <div>{user.activeStreak}</div>
                      <div>Weight:</div>
                      <div>{user.weight}</div>
                    </DataBox>
                    <DataBox>
                      <div>Lifetime Reps:</div>
                      <div>{user.lifetimeReps}</div>
                    </DataBox>
                    <DataBox>
                      <div>Activities:</div>
                      <div>{user.lifetimeWorkouts}</div>
                    </DataBox>
                    <DataBox>
                      <div>Latest Activity:</div>
                      <div>
                        {workoutHistory[0].date
                          .toDate()
                          .toString()
                          .slice(
                            0,
                            workoutHistory[0].date
                              .toDate()
                              .toString()
                              .indexOf(':') - 3
                          )}
                      </div>
                    </DataBox>
                  </Flex>
                </UserInfo>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    height: '100%',
                  }}
                >
                  <Link to="/exercise-form" className="link-reset hover-reset">
                    <StyledButton
                      style={{
                        backgroundColor: 'seagreen',
                        padding: '1.5rem',
                      }}
                    >
                      Start workout
                    </StyledButton>
                  </Link>
                </div>
              </UserDataContainer>
              {/* <AnalyticsContainer>
                <FALargeIcon>
                  <FontAwesomeIcon
                    icon={faPlus}
                    style={{ fontSize: '1.8rem', color: '#EE4A40' }}
                    onClick={() => history.push('/exercise-form')}
                  />
                </FALargeIcon>
              </AnalyticsContainer> */}
              <AnalyticsContainer
                style={{ marginTop: '2rem', justifyContent: 'flex-start' }}
              >
                <CustomWorkoutTitle
                  style={{
                    color: 'white',
                    padding: '1rem',
                    border: '3px solid #F9A26C',
                    borderRadius: '1rem',
                    marginLeft: '1rem',
                  }}
                >
                  Previous Workouts
                </CustomWorkoutTitle>
              </AnalyticsContainer>
              <WorkoutContainer>
                <Workouts>
                  {/* <FAMobileIcon style={{ width: '100%' }}>
                    <FontAwesomeIcon
                      icon={faPlus}
                      style={{ fontSize: '1.8rem', color: '#EE4A40' }}
                      onClick={() => history.push('/exercise-form')}
                    />
                  </FAMobileIcon> */}
                  <WorkoutBox>
                    <CustomWorkoutTitle>
                      {workoutHistory[0].date
                        .toDate()
                        .toString()
                        .slice(
                          0,
                          workoutHistory[0].date
                            .toDate()
                            .toString()
                            .indexOf(':') - 8
                        )}
                    </CustomWorkoutTitle>
                    <CustomWorkoutType>Squats</CustomWorkoutType>
                    <CustomWorkoutDetail>
                      Reps: {workoutHistory[0].squats.reps}
                    </CustomWorkoutDetail>
                    <CustomWorkoutDetail>
                      Sets: {workoutHistory[0].squats.sets}
                    </CustomWorkoutDetail>
                  </WorkoutBox>
                  <WorkoutBox>
                    <CustomWorkoutTitle>
                      {workoutHistory[1].date
                        .toDate()
                        .toString()
                        .slice(
                          0,
                          workoutHistory[1].date
                            .toDate()
                            .toString()
                            .indexOf(':') - 8
                        )}
                    </CustomWorkoutTitle>
                    <CustomWorkoutType>Squats</CustomWorkoutType>
                    <CustomWorkoutDetail>
                      Reps: {workoutHistory[1].squats.reps}
                    </CustomWorkoutDetail>
                    <CustomWorkoutDetail>
                      Sets: {workoutHistory[1].squats.sets}
                    </CustomWorkoutDetail>
                  </WorkoutBox>
                  <WorkoutBox>
                    <CustomWorkoutTitle>
                      {workoutHistory[2].date
                        .toDate()
                        .toString()
                        .slice(
                          0,
                          workoutHistory[2].date
                            .toDate()
                            .toString()
                            .indexOf(':') - 8
                        )}
                    </CustomWorkoutTitle>
                    <CustomWorkoutType>Squats</CustomWorkoutType>
                    <CustomWorkoutDetail>
                      Reps: {workoutHistory[2].squats.reps}
                    </CustomWorkoutDetail>
                    <CustomWorkoutDetail>
                      Sets: {workoutHistory[2].squats.sets}
                    </CustomWorkoutDetail>
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
                  <SettingsTitle>Username: </SettingsTitle>
                  <SettingsText>{currentUser.email}</SettingsText>
                </Row>
                <Row>
                  <SettingsTitle>Age: </SettingsTitle>
                  <SettingsText>{currentUser.email}</SettingsText>
                </Row>
                <Row>
                  <SettingsTitle>Weight: </SettingsTitle>
                  <SettingsText>{user.weight}</SettingsText>
                </Row>
                <Row>
                  <SettingsTitle>Sex: </SettingsTitle>
                  <SettingsText>{currentUser.email}</SettingsText>
                </Row>
              </CurrentSettings>
              <Link to="/update-profile" className="link-reset hover-reset">
                <StyledButton>Update Account Info</StyledButton>
              </Link>
              <Link to="/user-profile-form" className="link-reset hover-reset">
                <StyledButton>Update User Profile</StyledButton>
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
      ) : (
        ''
      )}
    </div>
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
    justify-content: space-evenly;
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
  }
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: #355c7d;
  border-radius: 2rem;
  color: white;
  justify-content: center;
  @media only screen and (min-width: 960px) {
    height: 100%;
    width: 70%;
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
  font-family: 'Inter';
  color: white;
  font-size: 2rem;
`;
const CustomWorkoutType = styled.p`
  color: white;
  font-size: 1.5rem;
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
  width: 100%;
  margin: 1rem;
  justify-content: center;
`;

const Flex = styled.div`
  display: flex;
`;

const UserName = styled.h1`
  font-family: 'Josefin Sans';
  font-size: 2rem;
  color: white;
`;
