import React, { useRef, useState } from 'react';
import { Button, Card, Form, Alert } from 'react-bootstrap';
import { useAuth } from '../components/contexts/AuthContext';
import { Link, useHistory } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import styled from 'styled-components';
import ball from '../../public/assets/images/ball.png';
import { db } from '../../firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';

export default function LoginForm() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login, googleSignin } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  async function googleSubmit() {
    try {
      let currentUser = await googleSignin();
      db.collection('users').doc(currentUser.user.uid).set(
        {
          email: currentUser.user.email,
          googleuser: true,
        },
        { merge: true }
      );

      const user = await db.collection('users').doc(currentUser.user.uid).get();

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

    try {
      setError('');
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value);
      history.push('/dashboard');
    } catch (error) {
      setError('Failed to sign in');
    }
    setLoading(false);
  }

  return (
    <GradientContainer>
      <ContentContainer>
        <div className="bootstrap-form-container">
          <Card className="bootstrap-form">
            <Card.Body>
              <h2 className="text-center mb-4">Log In</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group id="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    ref={emailRef}
                    placeholder="Enter your email address"
                    required
                  />
                </Form.Group>
                <Form.Group id="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    ref={passwordRef}
                    placeholder="Enter your password"
                    required
                  />
                </Form.Group>
                <Button
                  style={buttonStyle}
                  disable={loading.toString()}
                  type="submit"
                  className="w-100 text-center mt-2"
                >
                  Log In
                </Button>
              </Form>
              <Button
                style={googleButton}
                disable={loading.toString()}
                type="submit"
                className="w-100 text-center mt-2"
                onClick={googleSubmit}
              >
                Log in with
                <FontAwesomeIcon
                  style={{ marginLeft: '.5rem' }}
                  icon={faGoogle}
                />
              </Button>
              <div className="w-100 text-center mt-4">
                <Link to="/forgot-password" style={{ color: 'white' }}>
                  Forgot Password?
                </Link>
              </div>
            </Card.Body>
          </Card>
          <Box style={{ backgroundColor: '#F9A26C' }}>
            <NestedHeaderImage src={ball} />
          </Box>
        </div>
        <div className="w-100 text-center mt-2">
          Need an account? <Link to="/signup">Sign Up</Link>
        </div>
      </ContentContainer>
    </GradientContainer>
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
  @media only screen and (max-width: 960px) {
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
