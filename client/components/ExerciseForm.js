import React, { useRef, useState } from 'react';
import { Button, Card, Form, Alert } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import 'bootstrap/dist/css/bootstrap.min.css';
import app from '../../firebase';

export default function ExerciseForm() {
  const exerciseRef = useRef();
  const setRef = useRef();
  const repRef = useRef();

  const [error, setError] = useState('');
  // using this state to disable the signup button to keep the user from creating multiple accounts at the same time
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  async function handleSubmit(event) {
    event.preventDefault();

    let logedin = app.auth().currentUser.uid;
    console.log(logedin);

    try {
      // set error to an empty string so we have no error
      setError('');
      setLoading(true);

      const test = app
        .firestore()
        .collection('users')
        .doc('test1')
        .collection('newCollection2')
        .doc('anotherNewDoc2')
        .set({ hello: 'world' });

      let newCollection = app
        .firestore()
        .collection('users')
        .doc(logedin)
        .collection('setupWorkout')
        .doc()
        .set({
          Exercise: exerciseRef.current.value,
          Sets: setRef.current.value,
          Reps: repRef.current.value,
        });

      // newCollection.document('test').set({
      //   Exercise: exerciseRef.current.value,
      //   Sets: setRef.current.value,
      //   Reps: repRef.current.value,
      // });

      // .set({ new: 'test' }, { merge: true });

      // currentUser
      //   .create({
      //     collection: 'setupWorkout',
      //   })

      //   .then((res) => {
      //     console.log(`Document created at ${res.updateTime}`);
      //   })
      //   .catch((err) => {
      //     console.log(`Failed to create document: ${err}`);
      //   });

      // let snapshot = await currentUser.where().get();

      // snapshot.forEach((doc) => {
      //   workout.push(doc.data());
      // });

      // console.log(currentUser);

      // currentUser
      //   .collection('setupWorkout')
      // .set({
      //   Exercise: exerciseRef.current.value,
      //   Sets: setRef.current.value,
      //   Reps: repRef.current.value,
      // })
      // .then(history.push('/formcheck'))
      // .catch((error) => {
      //   console.log(
      //     'Something went wrong with adding setup exercise data to firestore: ',
      //     error
      //   );
      // });
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
                  {/* <Form.Label>Choose Exercise:</Form.Label> */}
                  {/* <Form.Control type="string" ref={exerciseRef} /> */}
                  <select>
                    <option value="default">Choose Exercise</option>
                    <option value="squat" ref={exerciseRef}>
                      Squat
                    </option>
                    <option value="pullup">Pullup</option>
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
  /* display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%; */

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
