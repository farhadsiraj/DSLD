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
                  <ProfilePicture
                    src={
                      user.imageUrl ||
                      `https://media-exp1.licdn.com/dms/image/C5635AQGFPFNGkZF98Q/profile-framedphoto-shrink_800_800/0/1611853400540?e=1613149200&v=beta&t=2o5qxmUaPU_hkJI6tIpRCJ8Pof_gEINpccaCIVSaTBM`
                    }
                  />
                  <UserName>{user.username}</UserName>

                  <Link to="/exercise-form" className="link-reset hover-reset">
                    <StyledButton
                      style={{
                        backgroundColor: '#6BE19B',
                        padding: '1rem',
                      }}
                    >
                      Start workout
                    </StyledButton>
                  </Link>
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
              </UserDataContainer>
              <AnalyticsContainer
                style={{ marginTop: '2rem', justifyContent: 'flex-start' }}
              >
                <CustomWorkoutTitle
                  style={{
                    color: '#355C7D',
                    paddingLeft: '1rem',
                    marginLeft: '1rem',
                  }}
                >
                  Previous Workouts
                </CustomWorkoutTitle>
              </AnalyticsContainer>
              <WorkoutContainer>
                {/* <Workouts>
                  {workoutHistory
                    .slice(0, Math.min(3, workoutHistory.length))
                    .map((ele, i) => {
                      return (
                        <WorkoutBox key={i}>
                          <CustomWorkoutTitle>
                            {ele.workout.type[0].toUpperCase() +
                              ele.workout.type.slice(1)}
                          </CustomWorkoutTitle>
                          <CustomWorkoutType className="lighter">
                            {ele.date
                              .toDate()
                              .toString()
                              .slice(
                                0,
                                ele.date.toDate().toString().indexOf(':') - 8
                              )}
                          </CustomWorkoutType>
                          <CustomWorkoutDetail>
                            <Title>Reps: </Title>
                            <Text>{ele.workout.reps}</Text>
                          </CustomWorkoutDetail>
                          <CustomWorkoutDetail>
                            <Title>Sets: </Title>
                            <Text>{ele.workout.sets}</Text>
                          </CustomWorkoutDetail>
                        </WorkoutBox>
                      );
                    })}
                </Workouts> */}
              </WorkoutContainer>
            </ColumnContainer>
            <AccountSettingsContainer>
              <CurrentSettings>
                <h2 style={{ color: 'white' }}>Account Settings</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Row>
                  <Title>Email: </Title>
                  <Text> {currentUser.email}</Text>
                </Row>
                <Row>
                  <Title>Username: </Title>
                  <Text>{user.username || 'n/a'}</Text>
                </Row>
                <Row>
                  <Title>Age: </Title>
                  <Text>{user.age || 'n/a'}</Text>
                </Row>
                <Row>
                  <Title>Weight: </Title>
                  <Text>{user.weight || 'n/a'}</Text>
                </Row>
                <Row>
                  <Title>Sex:{'  '}</Title>
                  <Text>{user.sex || 'n/a'}</Text>
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
  flex-direction: column;
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
  @media only screen and (min-width: 960px) {
    width: 12rem;
    height: 12rem;
  }
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: #355c7d;
  border-radius: 2rem;
  color: white;
  justify-content: center;
  align-items: center;
  @media only screen and (min-width: 960px) {
    flex-direction: row;
  }
`;

const Flex = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  @media only screen and (min-width: 960px) {
    flex-direction: row;
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
  margin: 0 1rem;
  border-radius: 2rem;
  align-items: center;
  justify-content: center;
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

const Title = styled.p`
  color: white;
  font-size: 1.2rem;
  padding-right: 0.5rem;
`;
const Text = styled.p`
  color: white;
  font-size: 1rem;
  font-weight: 300;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;

const DataBox = styled.div`
  flex: 1;
  width: 100%;
  margin: 1rem;
  justify-content: center;
`;

const UserName = styled.h1`
  font-family: 'Josefin Sans';
  font-size: 2rem;
  color: whitesmoke;
`;
