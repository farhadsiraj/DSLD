import React, { useRef, useState } from 'react';
import { Button, Card, Form, Alert } from 'react-bootstrap';
import { useAuth } from './contexts/AuthContext';
import { Link, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import 'bootstrap/dist/css/bootstrap.min.css';
import gym from '../../public/assets/images/gym.jpg';
import { db, auth } from '../../firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';

export default function Signup() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { signup, googleSignin } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  async function googleSubmit() {
    try {
      let currentUser = await googleSignin();
      console.log(currentUser);
      db.collection('users').doc(currentUser.user.uid).set(
        {
          email: currentUser.user.email,
          googleuser: true,
        },
        { merge: true }
      );

      const user = await db.collection('users').doc(currentUser.user.uid).get();
      console.log('user in googlesubmit', user.data());
      if (!user.data().username) {
        history.push('/user-profile-form');
      } else {
        history.push('/dashboard');
      }
    } catch (error) {
      setError('Failed to sign in');
    }
    setLoading(false);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError('Passwords do not match');
    }

    try {
      setError('');
      setLoading(true);
      await signup(emailRef.current.value, passwordRef.current.value).then(
        () => {
          db.collection('users')
            .doc(auth.currentUser.uid)
            .set({
              email: emailRef.current.value,
              lifetimeReps: 0,
              lifetimeSets: 0,
            })
            .catch((error) => {
              console.log(
                'Something went wrong with adding user to firestore: ',
                error
              );
            });
        }
      );
      history.push('/user-profile-form');
    } catch (error) {
      console.log(error);
      setError('Failed to create an account');
    }
    setLoading(false);
  }

  return (
    <>
      <GradientContainer>
        <ContentContainer>
          <div className="bootstrap-form-container">
            <Card className="bootstrap-form">
              <Card.Body>
                <h2 className="text-center mb-4">Sign Up</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                  <Form.Group id="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      ref={emailRef}
                      placeholder="Enter your email address"
                      // required
                    />
                  </Form.Group>
                  <Form.Group id="password">
                    <Form.Label>
                      Password (Must be at least 6 characters)
                    </Form.Label>

                    <Form.Control
                      type="password"
                      ref={passwordRef}
                      placeholder="Enter a password"
                      // required
                    />
                  </Form.Group>
                  <Form.Group id="password-confirm">
                    <Form.Label>Password Confirmation</Form.Label>
                    <Form.Control
                      type="password"
                      ref={passwordConfirmRef}
                      placeholder="Enter same password from above"
                      // required
                    />
                  </Form.Group>
                  <Button
                    style={buttonStyle}
                    disable={loading.toString()}
                    type="submit"
                    className="w-100 text-center mt-2"
                  >
                    Sign Up
                  </Button>
                  <Button
                    style={googleButton}
                    disable={loading.toString()}
                    type="submit"
                    className="w-100 text-center mt-2"
                    onClick={googleSubmit}
                  >
                    Sign up with
                    <FontAwesomeIcon
                      style={{ marginLeft: '.5rem' }}
                      icon={faGoogle}
                    />
                  </Button>
                </Form>
              </Card.Body>
            </Card>
            <NestedHeaderImage src={gym} />
          </div>
          <div className="w-100 text-center mt-3">
            Already have an account? <Link to="/login">Log In</Link>
          </div>
        </ContentContainer>
      </GradientContainer>
    </>
  );
}

const buttonStyle = {
  backgroundColor: '#F9A26C',
  border: 'none',
};

const googleButton = {
  backgroundColor: '#9BD7D1',
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

const NestedHeaderImage = styled.img`
  display: none;
  @media only screen and (min-width: 960px) {
    display: flex;
    object-fit: cover;
    width: 30rem;
    max-height: 100%;
    max-width: 90%;
    border-radius: 2rem;
    margin-left: -10rem;
    margin-top: 6rem;
  }
`;
