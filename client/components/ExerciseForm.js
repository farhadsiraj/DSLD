import React, { useRef, useState } from 'react';
import { Button, Card, Form, Alert } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import 'bootstrap/dist/css/bootstrap.min.css';
import app from '../../firebase';

export default function ExerciseForm() {
  const exerciseRef = useRef();
  const setRef = useRef();
  const repRef = useRef();

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  async function handleSubmit(event) {
    event.preventDefault();

    let logedin = app.auth().currentUser.uid;
    console.log('loggedin----->', logedin);

    try {
      setError('');
      setLoading(true);

      let newCollection = app
        .firestore()
        .collection('users')
        .doc(logedin)
        .collection('setupWorkout')
        .doc('setup')
        .set({
          exercise: exerciseRef.current.value,
          sets: setRef.current.value,
          reps: repRef.current.value,
        })
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
    <>
      <GradientContainer>
        <ContentContainer>
          <Card>
            <Card.Body>
              <h2 className="text-center mb-4">Exercise Form</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group id="exercises">
                  <select>
                    <option value="default">Choose Exercise</option>
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
                <Button
                  disable={loading.toString()}
                  type="submit"
                  className="w-100 text-center mt-2"
                >
                  Start Workout
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </ContentContainer>
      </GradientContainer>
    </>
  );
}

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
