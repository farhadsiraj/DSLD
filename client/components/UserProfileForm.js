import React, { useRef, useState, useEffect } from 'react';
import { Button, Card, Form, Alert } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import 'bootstrap/dist/css/bootstrap.min.css';
import ball from '../../public/assets/images/ball.png';
import { db, auth } from '../../firebase';

export default function UserProfileForm() {
  const usernameRef = useRef();
  const heightRef = useRef();
  const weightRef = useRef();
  const ageRef = useRef();
  const sexRef = useRef();

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const history = useHistory();

  useEffect(async () => {
    console.log(auth.currentUser.uid);
    const userRef = db.collection('users').doc(auth.currentUser.uid);
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      console.log('No user data is available.');
      setUser('N/A');
    } else {
      console.log(userDoc.data());
      setUser(userDoc.data());
    }
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setError('');
      setLoading(true);

      let usersRef = db.collection('users');
      let snapshot = await usersRef
        .where('username', '==', usernameRef.current.value)
        .get();
      snapshot.forEach((doc) => {
        if (doc.data()) {
          setError('Username not available');
          throw new Error('Username not available');
        }
      });

      db.collection('users')
        .doc(auth.currentUser.uid)
        .set(
          {
            username: usernameRef.current.value,
            age: ageRef.current.value,
            height: heightRef.current.value,
            weight: weightRef.current.value,
            sex: sexRef.current.value,
          },
          { merge: true }
        )
        .then(() => history.push('/dashboard'))
        .catch((error) => {
          console.log(
            'Something went wrong with adding user data to firestore: ',
            error
          );
        });
    } catch (error) {
      console.log(error);
      if (error === '') {
        setError('Failed to update user profile');
      }
    }
    setLoading(false);
  }
  return (
    <GradientContainer>
      <ContentContainer>
        <div style={cards}>
          <Card style={cardStyle}>
            <Card.Body>
              <h2 className="text-center mb-4">User Profile</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group id="username">
                  <Form.Label>Username:</Form.Label>
                  <Form.Control type="string" ref={usernameRef} />
                </Form.Group>
                <Form.Group id="age">
                  <Form.Label>Age:</Form.Label>
                  <Form.Control type="integer" ref={ageRef} />
                </Form.Group>
                <Form.Group id="height">
                  <Form.Label>Height:</Form.Label>
                  <Form.Control type="integer" ref={heightRef} />
                </Form.Group>
                <Form.Group id="weight">
                  <Form.Label>Weight:</Form.Label>
                  <Form.Control type="integer" ref={weightRef} />
                </Form.Group>
                <Form.Group id="sex">
                  <Form.Label>Sex:</Form.Label>
                  <Form.Control type="integer" ref={sexRef} />
                </Form.Group>
                <Button
                  style={buttonStyle}
                  disable={loading.toString()}
                  type="submit"
                  className="w-100 text-center mt-2"
                >
                  Update
                </Button>
              </Form>
            </Card.Body>
          </Card>
          <Box style={{ backgroundColor: '#F9A26C' }}>
            <ImageBox src={ball} />
          </Box>
        </div>
        <div className="w-100 text-center mt-3">
          <Link to="/dashboard">Cancel</Link>
        </div>
      </ContentContainer>
    </GradientContainer>
  );
}

const cards = {
  display: 'flex',
};

const cardStyle = {
  color: 'white',
  backgroundColor: '#355c7d',
  marginTop: '5rem',
  borderRadius: '2rem',
  paddingTop: '2rem',
  paddingBottom: '4rem',
  paddingLeft: '4rem',
  paddingRight: '4rem',
  height: '42rem',
  width: '35rem',
};

const buttonStyle = {
  backgroundColor: '#F9A26C',
  border: 'none',
};

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

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 65px;
  z-index: 1;
`;

const Box = styled.div`
  display: flex;
  flex-direction: column;
  width: 37rem;
  height: 42rem;
  background-color: #355c7d;
  margin: 1rem;
  margin-top: 5rem;
  margin-left: -8rem;
  border-radius: 2rem;
  justify-content: center;
  align-items: center;
  padding-top: 2rem;
  padding-bottom: 2rem;
  @media only screen and (max-width: 1060px) {
    display: none;
  }
`;

const ImageBox = styled.img`
  width: 70%;
  height: auto;
  max-width: 100%;
  padding: 1rem;
  margin-left: 7rem;
`;
