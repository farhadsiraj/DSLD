import React, { useRef, useState } from 'react';
import { Button, Card, Form, Alert } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import 'bootstrap/dist/css/bootstrap.min.css';
import press from '../../public/assets/images/press.png';
import { Link } from 'react-router-dom';
import { db, auth } from '../../firebase';

export default function ExerciseForm() {
  const exerciseRef = useRef();
  const setRef = useRef();
  const repRef = useRef();
  const restTimerRef = useRef();

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  async function handleSubmit(event) {
    event.preventDefault();

    let loggedIn = auth.currentUser.uid;

    try {
      setError('');
      setLoading(true);

      db.collection('users')
        .doc(loggedIn)
        .collection('setupWorkout')
        .doc('setup')
        .set(
          {
            exercise: exerciseRef.current.value,
            sets: setRef.current.value,
            reps: repRef.current.value,
            restTimer: restTimerRef.current.value,
          },
          { merge: true }
        )
        .then(history.push('/formcheck'))
        .catch((error) => {
          console.log(
            'Something went wrong with adding setup exercise data to firestore: ',
            error
          );
        });
    } catch (error) {
      console.log(error);
      if (error === '') {
        setError('Failed to update setup exercise profile');
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
              <h2 className="text-center mb-4">Exercise Form</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group id="exercises">
                  <select style={selectForm} defaultValue="default">
                    <option value="default" disabled>
                      Choose Exercise
                    </option>
                    <option value="squat" ref={exerciseRef}>
                      Squat
                    </option>
                  </select>
                </Form.Group>
                <Form.Group id="sets">
                  <Form.Label>Sets:</Form.Label>
                  <Form.Control type="integer" ref={setRef} />
                </Form.Group>
                <Form.Group id="reps">
                  <Form.Label>Reps:</Form.Label>
                  <Form.Control type="integer" ref={repRef} />
                </Form.Group>
                <Form.Group id="rest">
                  <Form.Label>Rest Timer:</Form.Label>
                  <Form.Control type="integer" ref={restTimerRef} />
                </Form.Group>
                <Button
                  style={buttonStyle}
                  disable={loading.toString()}
                  type="submit"
                  className="w-100 text-center mt-4"
                >
                  Start Workout
                </Button>
              </Form>
            </Card.Body>
          </Card>
          <Box style={{ backgroundColor: '#9bd7d1' }}>
            <ImageBox src={press} />
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
  marginTop: '10rem',
  borderRadius: '2rem',
  paddingTop: '2rem',
  paddingBottom: '4rem',
  paddingLeft: '4rem',
  paddingRight: '4rem',
  height: '30rem',
  width: '30rem',
};

const selectForm = {
  height: '2.25rem',
  borderRadius: '.25rem',
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
  height: 30rem;
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
  width: 80%;
  height: auto;
  max-width: 100%;
  padding: 1rem;
  margin-left: 7rem;
`;
