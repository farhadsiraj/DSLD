import React, { useRef, useState } from 'react';
import { Button, Card, Form, Alert } from 'react-bootstrap';
import { useAuth } from '../components/contexts/AuthContext';
import { Link, useHistory } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import styled from 'styled-components';
import ball from '../../public/assets/images/ball.png';

export default function LoginForm() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const history = useHistory();

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
        <div style={cards}>
          <Card style={cardStyle}>
            <Card.Body>
              <h2 className="text-center mb-4">Log In</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group id="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" ref={emailRef} required />
                </Form.Group>
                <Form.Group id="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" ref={passwordRef} required />
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
              <div className="w-100 text-center mt-4">
                <Link to="/forgot-password" style={{ color: 'white' }}>
                  Forgot Password?
                </Link>
              </div>
            </Card.Body>
          </Card>
          <Box style={{ backgroundColor: '#F9A26C' }}>
            <ImageBox src={ball} />
          </Box>
        </div>
        <div className="w-100 text-center mt-2">
          Need an account? <Link to="/signup">Sign Up</Link>
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
  marginTop: '10rem',
  borderRadius: '2rem',
  paddingTop: '2rem',
  paddingBottom: '4rem',
  paddingLeft: '4rem',
  paddingRight: '4rem',
  height: '28rem',
  width: '30rem',
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
  width: 33rem;
  height: 28rem;
  background-color: #355c7d;
  margin: 1rem;
  margin-top: 10rem;
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

const ImageBox = styled.img`
  width: 70%;
  height: auto;
  max-width: 100%;
  padding: 1rem;
  margin-left: 7rem;
`;
