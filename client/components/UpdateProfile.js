import React, { useRef, useState } from 'react';
import { Button, Card, Form, Alert } from 'react-bootstrap';
import { useAuth } from './contexts/AuthContext';
import { Link, useHistory } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import styled from 'styled-components';
import gym from '../../public/assets/images/gym.jpg';
import firebase from 'firebase';
import { auth } from '../../firebase';
import { distSquared } from '@tensorflow/tfjs-core/dist/util';

export default function UpdateProfile() {
  const emailRef = useRef();
  const currentPasswordRef = useRef();
  const newPasswordRef = useRef();
  const newPasswordConfirmRef = useRef();
  const { currentUser, updateEmail, updatePassword } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  console.log('hello');

  function handleSubmit(event) {
    event.preventDefault();
    console.log('hello from handle');
    console.log('currentPasswordRef in handlesubmit', currenPasswordRef);

    const promises = [];
    setError('');
    setLoading(true);

    if (currentPasswordRef) {
      const reauthenticate = (currentPassword) => {
        var cred = auth.EmailAuthProvider.credential(
          currentUser.email,
          currentPassword
        );
        return currentUser.reauthenticateWithCredential(cred);
      };

      reauthenticate(currentPasswordRef).then(() => {
        if (emailRef.current.value !== currentUser.email) {
          promises.push(updateEmail(emailRef.current.value));
        }
        if (newPasswordRef.current.value) {
          promises.push(updatePassword(newPasswordRef.current.value));
        }
      });

      Promise.all(promises)
        .then(() => {
          history.push('/dashboard');
        })
        .catch(() => {
          setError('Failed to update account');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }

  return (
    <GradientContainer>
      <ContentContainer>
        <div className="bootstrap-form-container">
          <Card className="bootstrap-form">
            <Card.Body>
              <h2 className="text-center mb-4">Update Profile</h2>
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
                <Form.Group id="currentPassword">
                  <Form.Label>Current Password</Form.Label>
                  <Form.Control
                    type="password"
                    ref={currentPasswordRef}
                    placeholder="Enter current password"
                  />
                </Form.Group>
                <Form.Group id="newPassword">
                  <Form.Label>New Password</Form.Label>
                  <Form.Control
                    type="password"
                    ref={newPasswordRef}
                    placeholder="Leave blank to keep the same"
                  />
                </Form.Group>
                <Form.Group id="newPassword-confirm">
                  <Form.Label>New Password Confirmation</Form.Label>
                  <Form.Control
                    type="password"
                    ref={newPasswordConfirmRef}
                    placeholder="Leave blank to keep the same"
                  />
                </Form.Group>
                <Button
                  style={buttonStyle}
                  disable={loading}
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
        <Link to="/dashboard">Cancel</Link>
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
    height: 31.3rem;
    max-height: 100%;
    max-width: 90%;
    border-radius: 2rem;
    margin-left: -10rem;
    margin-top: 6rem;
  }
`;
