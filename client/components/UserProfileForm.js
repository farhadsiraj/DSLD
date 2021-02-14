import React, { useRef, useState } from 'react';
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

  const history = useHistory();

  function handleChange(event) {
    sexRef.current.value = event.target.value;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setError('');
      setLoading(true);

      // let usersRef = db.collection('users');
      // let snapshot = await usersRef
      //   .where('username', '==', usernameRef.current.value)
      //   .get();

      // snapshot.forEach((doc) => {
      //   if (doc.data()) {
      //     setError('Username not available');
      //     throw new Error('Username not available');
      //   }
      // });

      let updatedInfo = {};
      if (usernameRef.current.value)
        updatedInfo.username = usernameRef.current.value;
      if (ageRef.current.value) updatedInfo.age = ageRef.current.value;
      if (heightRef.current.value) updatedInfo.height = heightRef.current.value;
      if (weightRef.current.value) updatedInfo.weight = weightRef.current.value;
      if (sexRef.current.value) updatedInfo.sex = sexRef.current.value;

      db.collection('users')
        .doc(auth.currentUser.uid)
        .set(updatedInfo, { merge: true })
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
        <div className="bootstrap-form-container">
          <Card className="bootstrap-form">
            <Card.Body>
              <h2 className="text-center mb-4">User Profile</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group id="username">
                  <Form.Label>Username:</Form.Label>
                  <Form.Control
                    type="string"
                    ref={usernameRef}
                    placeholder="Enter a username"
                  />
                </Form.Group>
                <Form.Group id="age">
                  <Form.Label>Age:</Form.Label>
                  <Form.Control
                    type="integer"
                    ref={ageRef}
                    placeholder="Enter your age"
                    maxLength="3"
                    pattern="^([1-9]|[1-9][0-9]|[1-9][0-9][0-9])$"
                  />
                </Form.Group>
                <Form.Group id="height">
                  <Form.Label>Height:</Form.Label>
                  <Form.Control
                    type="integer"
                    ref={heightRef}
                    placeholder="Enter your height in inches"
                    maxLength="3"
                    pattern="^([1-9]|[1-9][0-9]|[1-9][0-9][0-9])$"
                  />
                </Form.Group>
                <Form.Group id="weight">
                  <Form.Label>Weight:</Form.Label>
                  <Form.Control
                    type="integer"
                    ref={weightRef}
                    placeholder="Enter your weight"
                    maxLength="3"
                    pattern="^([1-9]|[1-9][0-9]|[1-9][0-9][0-9])$"
                  />
                </Form.Group>
                <Form.Group id="sex" style={selectStyle}>
                  <Form.Label>Sex:</Form.Label>
                  <select
                    style={selectBox}
                    onChange={(event) => handleChange(event)}
                    defaultValue="default"
                  >
                    <option value="default" disabled>
                      Choose Sex:
                    </option>
                    <option value="Male" ref={sexRef}>
                      Male
                    </option>
                    <option value="Female" ref={sexRef}>
                      Female
                    </option>
                  </select>
                </Form.Group>
                <Button
                  style={buttonStyle}
                  disable={loading.toString()}
                  type="submit"
                  className="w-100 text-center"
                >
                  Update
                </Button>
              </Form>
            </Card.Body>
          </Card>
          <Box style={{ backgroundColor: '#F9A26C' }}>
            <NestedHeaderImage src={ball} />
          </Box>
        </div>
      </ContentContainer>
      <div className="w-100 text-center mt-3">
        <Link to="/dashboard">Cancel</Link>
      </div>
    </GradientContainer>
  );
}

const selectStyle = {
  display: 'flex',
  flexDirection: 'column',
};

const selectBox = {
  height: '2.58rem',
  borderRadius: '.30rem',
};

const buttonStyle = {
  backgroundColor: '#F9A26C',
  border: 'none',
  marginTop: '1.5rem',
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
  width: 32rem;
  height: auto;
  background-color: #355c7d;
  margin-top: 6rem;
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

const NestedHeaderImage = styled.img`
  display: none;
  @media only screen and (min-width: 960px) {
    display: flex;
    object-fit: cover;
    width: 30rem;
    max-height: 100%;
    max-width: 90%;
    border-radius: 2rem;
    margin-left: 0rem;
  }
`;
