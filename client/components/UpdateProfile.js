import React, { useRef, useState } from 'react';
import { Button, Card, Form, Alert } from 'react-bootstrap';
import { useAuth } from './contexts/AuthContext';
import { Link, useHistory } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import styled from 'styled-components';
import gym from '../../public/assets/images/gym.jpg';
import { firebase } from '../../firebase';

export default function UpdateProfile() {
  const emailRef = useRef();
  const currentPasswordRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { currentUser, updateEmail, updatePassword } = useAuth();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  function reauthenticate(currentPassword) {
    let credential = firebase.auth.EmailAuthProvider.credential(
      currentUser.email,
      currentPassword
    );

    return currentUser.reauthenticateWithCredential(credential);
  }

  function handleSubmit(event) {
    event.preventDefault();

    reauthenticate(currentPasswordRef.current.value)
      .then(() => {
        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
          return setError('Passwords do not match');
        }
        const promises = [];
        setError('');
        setLoading(true);
        if (emailRef.current.value !== currentUser.email) {
          promises.push(updateEmail(emailRef.current.value));
        }
        if (passwordRef.current.value) {
          promises.push(updatePassword(passwordRef.current.value));
        }

        Promise.all(promises)
          .then(() => {
            setMessage(
              'Account settings updated. Redirecting to your profile...'
            );
            setTimeout(() => {
              history.push('/dashboard');
            }, 3000);
          })
          .catch(() => {
            setError('Failed to update account');
          })
          .finally(() => {
            setLoading(false);
          });
      })
      .catch((error) => {
        setError('Current password is incorrect');
      });
  }

  function selectText(event) {
    const input = event.target;
    input.focus();
    input.select();
  }

  return (
    <GradientContainer>
      <ContentContainer>
        <div className="bootstrap-form-container">
          <Card className="bootstrap-form">
            <Card.Body>
              <h2 className="text-center mb-4">Update Profile</h2>
              {message && <Alert variant="success">{message}</Alert>}
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group id="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    ref={emailRef}
                    required
                    defaultValue={currentUser.email}
                    onClick={(event) => selectText(event)}
                  />
                </Form.Group>
                <Form.Group id="password">
                  <Form.Label>Current Password</Form.Label>
                  <Form.Control
                    type="password"
                    ref={currentPasswordRef}
                    placeholder="Enter current password"
                  />
                </Form.Group>
                <Form.Group id="password">
                  <Form.Label>New Password</Form.Label>
                  <Form.Control
                    type="password"
                    ref={passwordRef}
                    placeholder="Leave blank to keep the same"
                  />
                </Form.Group>
                <Form.Group id="password-confirm">
                  <Form.Label>New Password Confirmation</Form.Label>
                  <Form.Control
                    type="password"
                    ref={passwordConfirmRef}
                    placeholder="Leave blank to keep the same"
                  />
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
          <NestedHeaderImage src={gym} />
        </div>
      </ContentContainer>
      <div className="w-100 text-center mt-3">
        <Link to="/dashboard">Return to your profile</Link>
      </div>
    </GradientContainer>
  );
}

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

const NestedHeaderImage = styled.img`
  display: none;
  @media only screen and (min-width: 960px) {
    display: flex;
    object-fit: cover;
    width: 30rem;
    height: auto;
    max-height: 100%;
    max-width: 90%;
    border-radius: 2rem;
    margin-left: -10rem;
    margin-top: 6rem;
  }
`;
