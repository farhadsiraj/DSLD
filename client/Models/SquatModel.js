import React, { useEffect, useState } from 'react';
import * as tmPose from '@teachablemachine/pose';
import positiveFeedback from '../../public/assets/audio/positiveFeedback_v1.mp3';
import negativeFeedback from '../../public/assets/audio/negativeFeedback_v1.mp3';
import styled from 'styled-components';
import { db, auth } from '../../firebase';
import { useHistory } from 'react-router-dom';

// needs to be outside of Model function scope to toggle Start/Stop
let loggedIn;
let repCount = 0;
let startingPosition;
let squattingPosition;
let middlePosition;
let setupPosition;
let counterStatus = 'pending';
let lineColor = '#9BD7D1';
let exercise;
let restTimer;
let lifetimeReps;
let lifetimeSets;
let totalSets;
let setCount;
let totalReps; // Number of reps user specifies
let successfulReps; // Used for accuracy, decremented with failed squat
let reps; // Counter that decrements at each squat attempt
let predictStatus = 'pending';
let accuracy;
let startAnimation;
let startAnimation2;

export function Model() {
  const [isLoading, setIsLoading] = useState(true);
  const [toggleStart, setToggle] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const history = useHistory();

  loggedIn = auth.currentUser.uid;

  async function setLifetimeStats() {
    const usersRef = db.collection('users').doc(loggedIn);

    const doc = await usersRef.get();
    if (!doc.exists) {
      console.log('No user data found.');
    } else {
      const user = doc.data();
      console.log(user);
      lifetimeReps = user.lifetimeReps;
      lifetimeSets = user.lifetimeSets;
      console.log('lifetimeStats', lifetimeReps, lifetimeSets);
    }
  }
  setLifetimeStats();

  async function setRepPrefs() {
    const usersRef = db
      .collection('users')
      .doc(loggedIn)
      .collection('setupWorkout')
      .doc('setup');
    const doc = await usersRef.get();
    if (!doc.exists) {
      console.log('No default workout preferences set.');
    } else {
      const user = doc.data();
      exercise = user.exercise;
      totalReps = user.reps;
      successfulReps = user.reps * user.sets;
      reps = user.reps;
      totalSets = user.sets;
      setCount = totalSets;
      restTimer = user.restTimer;
      console.log('Total Reps from Firestore', totalReps);
    }
  }
  setRepPrefs();

  // Squat v2
  // https://teachablemachine.withgoogle.com/models/J5d1HwacC/
  // Squat v3
  // https://teachablemachine.withgoogle.com/models/gzTttOI1O/

  const URL = 'https://teachablemachine.withgoogle.com/models/gzTttOI1O/';
  let model, webcam, ctx, labelContainer, maxPredictions;

  async function init() {
    const modelURL = URL + 'model.json';
    const metadataURL = URL + 'metadata.json';

    model = await tmPose.load(modelURL, metadataURL);

    maxPredictions = model.getTotalClasses();

    const size = 640;
    const flip = true;
    webcam = new tmPose.Webcam(size, 480, flip);

    await webcam.setup({ facingMode: 'user' });
    let iosVid = document.getElementById('webcam-container');
    iosVid.appendChild(webcam.webcam);
    let videoElement = document.getElementsByTagName('video')[0];
    videoElement.setAttribute('playsinline', true);
    videoElement.muted = 'true';
    videoElement.id = 'webcamVideo';

    await webcam.play();

    startAnimation = window.requestAnimationFrame(loop);

    const canvas = document.getElementById('canvas');
    canvas.width = size;
    canvas.height = 480;
    ctx = canvas.getContext('2d');
    // labelContainer = document.getElementById('label-container');
    // for (let i = 0; i < maxPredictions; i++) {
    //   labelContainer.appendChild(document.createElement('div'));
    // }
  }

  async function loop() {
    webcam.update();

    // app starts with prediction active and drawPose using poseNet
    if (predictStatus === 'active') {
      // document.getElementById('togglePredict').innerHTML('Pause');
      await predict(true);
    }
    // when pause button is pressed, drawPose switches to webcam feed
    if (predictStatus === 'pending') {
      drawPose();
      await predict(false);
    }

    startAnimation2 = window.requestAnimationFrame(loop);
  }

  async function predict(bool) {
    if (bool === true) {
      const { pose, posenetOutput } = await model.estimatePose(webcam.canvas);
      const prediction = await model.predict(posenetOutput);

      for (let i = 0; i < maxPredictions; i++) {
        const classPrediction = `${prediction[i].className}: ${Math.ceil(
          prediction[i].probability.toFixed(2) * 100
        )}%`;

        // labelContainer.childNodes[i].innerHTML = classPrediction;
      }

      drawPose(pose, lineColor);

      startingPosition = prediction[1].probability;
      squattingPosition = prediction[3].probability;
      middlePosition = prediction[2].probability;
      setupPosition = prediction[0].probability;

      let canvasBorder = document.getElementById('canvas');

      if (setCount > 0) {
        if (counterStatus === 'pending' && startingPosition > 0.9) {
          counterStatus = 'starting';
        }

        if (counterStatus === 'starting' && middlePosition > 0.5) {
          counterStatus = 'middle';
        }

        if (counterStatus === 'middle' && squattingPosition > 0.9) {
          counterStatus = 'squatting';
        }

        if (counterStatus === 'squatting' && startingPosition > 0.9) {
          lineColor = '#39E47E';
          drawPose(pose, lineColor);
          canvasBorder.style.border = `20px solid ${lineColor}`;
          repCount = repCount + 1;
          playAudio(positiveFeedback);
          counterStatus = 'pending';
          reps = reps - 1;
        }

        if (counterStatus === 'middle' && startingPosition > 0.9) {
          lineColor = '#EE4A40';
          canvasBorder.style.border = `20px solid ${lineColor}`;
          drawPose(pose, lineColor);
          successfulReps = successfulReps - 1;
          playAudio(negativeFeedback);
          counterStatus = 'pending';
          reps = reps - 1;
        }

        let denominator = totalReps * totalSets;

        accuracy = Math.ceil((successfulReps / denominator) * 100);

        if (reps <= 0) {
          setCount--;
          if (setCount === 0) {
            db.collection('users')
              .doc(loggedIn)
              .collection('workoutHistory')
              .doc()
              .set(
                {
                  date: new Date(),
                  workout: {
                    type: exercise,
                    sets: totalSets,
                    reps: totalReps,
                    accuracy: accuracy,
                    successfulReps: successfulReps,
                  },
                },
                { merge: true }
              );
            db.collection('users')
              .doc(loggedIn)
              .set(
                {
                  lifetimeReps: lifetimeReps + successfulReps,
                  lifetimeSets: lifetimeSets + totalSets,
                },
                { merge: true }
              );
            counterStatus = 'pending';
            lineColor = '#9BD7D1';
            totalReps = 0;
            setModalOpen(!modalOpen);
            togglePredict();
            window.cancelAnimationFrame(startAnimation);
            window.cancelAnimationFrame(startAnimation2);
          } else {
            togglePredict();
            countdown(restTimer, togglePredict);
            reps = totalReps;
          }
        }
      }

      if (setCount) {
        let repContainer = document.getElementById('rep-container');
        if (repContainer !== null) {
          repContainer.innerHTML = `Total Reps: ${repCount}`;

          let setContainer = document.getElementById('set-container');
          setContainer.innerHTML = `Total Sets: ${totalSets}`;

          let accContainer = document.getElementById('acc-container');
          accContainer.innerHTML = `Accuracy: ${accuracy}%`;

          let remRepsContainer = document.getElementById('rem-reps-container');
          remRepsContainer.innerHTML = `Remaining Reps: ${reps}`;

          let remSetsContainer = document.getElementById('rem-sets-container');
          remSetsContainer.innerHTML = `Remaining Sets: ${setCount}`;
        }

        let repContainer1 = document.getElementById('rep1-container');
        if (repContainer1 !== null) {
          repContainer1.innerHTML = `Total Reps: ${repCount}`;

          let setContainer1 = document.getElementById('set1-container');
          setContainer1.innerHTML = `Total Sets: ${totalSets}`;

          let accContainer1 = document.getElementById('acc1-container');
          accContainer1.innerHTML = `Accuracy: ${accuracy}%`;

          let remRepsContainer1 = document.getElementById(
            'rem1-reps-container'
          );
          remRepsContainer1.innerHTML = `Remaining Reps: ${reps}`;

          let remSetsContainer1 = document.getElementById(
            'rem1-sets-container'
          );
          remSetsContainer1.innerHTML = `Remaining Sets: ${setCount}`;
        }
      }
    } else {
      return;
    }
  }

  function drawPose(pose, color) {
    if (webcam.canvas) {
      ctx.drawImage(webcam.canvas, 0, 0);
      if (pose) {
        const minPartConfidence = 0.5;

        tmPose.drawKeypoints(
          pose.keypoints,
          minPartConfidence,
          ctx,
          5,
          color,
          color
        );
        tmPose.drawSkeleton(pose.keypoints, minPartConfidence, ctx, 5, color);
      }
    }
  }

  async function togglePredict() {
    console.log('predictStatus', predictStatus);
    if (predictStatus === 'pending') {
      predictStatus = 'active';
    } else if (predictStatus === 'active') {
      predictStatus = 'pending';
    }
  }

  let sound;

  async function playAudio(audio) {
    const context = new AudioContext();
    await window
      .fetch(audio)
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => context.decodeAudioData(arrayBuffer))
      .then((audioBuffer) => {
        sound = audioBuffer;
      });

    const source = context.createBufferSource();
    source.buffer = sound;
    source.connect(context.destination);
    source.start();
  }

  useEffect(() => {
    init();

    return function cleanup() {
      if (predictStatus === 'active') togglePredict();

      window.cancelAnimationFrame(startAnimation);
      window.cancelAnimationFrame(startAnimation2);
    };
  }, []);

  let seconds;
  function countdown(time, callback, val) {
    seconds = time;
    let countdownSeconds = document.getElementById('timer');
    countdownSeconds.innerHTML = seconds;
    let counter = setInterval(() => {
      seconds--;
      countdownSeconds.innerHTML = seconds;
      if (seconds === 0) {
        countdownSeconds.innerHTML = 'Active';
        clearInterval(counter);
        callback(val);
      }
    }, 1000);
  }

  return (
    <ContentContainer>
      {modalOpen && (
        <>
          <ModalContainer>
            <Modal>
              <h3>Great Work!</h3>
              <h4>
                {' '}
                You did {totalReps * totalSets} {exercise} in {totalSets} sets
                with an accuracy of {accuracy}%.
              </h4>
              <Button onClick={() => history.push('/exercise-form')}>
                Do another workout
              </Button>
              <Button onClick={() => history.push('/dashboard')}>
                Back to Dashboard
              </Button>
            </Modal>
          </ModalContainer>
        </>
      )}
      <ModelContainer>
        <TopToolbar>
          <WorkoutType>Squats</WorkoutType>
          <WorkoutType id="timer">
            {toggleStart === 'active' ? 'Active' : 'Inactive'}{' '}
          </WorkoutType>
        </TopToolbar>
        <WebcamDataContainer>
          <Webcam>
            <div id="webcam-container" style={{ display: 'none' }}></div>
            <canvas
              style={{ borderRadius: '1rem' }}
              width="640"
              height="480"
              id="canvas"
            ></canvas>
            <WebcamToolbar>
              <RemainingRepCount id="rem-reps-container">
                Are you ready to get DSLD?
              </RemainingRepCount>
              <Button
                id="togglePredict"
                onClick={() => {
                  if (predictStatus === 'pending') {
                    countdown(5, togglePredict);
                  } else {
                    togglePredict();
                  }
                  setToggle(!toggleStart);
                }}
              >
                {toggleStart ? 'Stop' : 'Start'}
              </Button>
              <LabelContainer id="workout-data-small">
                {document.getElementById('workout-data-small') ? (
                  <>
                    {/* <Label id="rem-reps-container">
                      Remaining Reps: Loading...
                    </Label> */}
                    <Label id="acc-container">Accuracy: Loading...</Label>
                    <Label id="rep-container">Reps: Loading...</Label>
                    <Label id="set-container">Set: Loading...</Label>
                    <Label id="rem-sets-container">
                      Remaining Sets: Loading...
                    </Label>
                  </>
                ) : (
                  <Label>Press Start To Begin</Label>
                )}
                <Label id="rem-reps-container"></Label>
                <Label id="acc-container"></Label>
                <Label id="rep-container"></Label>
                <Label id="set-container"></Label>
                <Label id="rem-sets-container"></Label>
              </LabelContainer>
            </WebcamToolbar>
          </Webcam>
          <LabelContainerLarge id="workout-data-large">
            {document.getElementById('workout-data-large') ? (
              <>
                <Label id="rem1-reps-container">
                  Remaining Reps: Loading...
                </Label>
                <Label id="acc1-container">Accuracy: Loading...</Label>
                <Label id="rep1-container">Reps: Loading...</Label>
                <Label id="set1-container">Set: Loading...</Label>
                <Label id="rem1-sets-container">
                  Remaining Sets: Loading...
                </Label>
              </>
            ) : (
              <Label>Press Start To Begin</Label>
            )}
          </LabelContainerLarge>
        </WebcamDataContainer>
      </ModelContainer>
    </ContentContainer>
  );
}

const ModalContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Modal = styled.div`
  padding: 20px;
  min-height: 200px;
  color: white;

  display: flex;
  flex-direction: column;
  width: 50%;
  height: 50%;
  background-color: #355c7d;
  margin: 1rem;
  border-radius: 2rem;
  justify-content: center;
  align-items: center;
  padding-top: 2rem;
  padding-bottom: 2rem;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 65px;
  height: 100%;
  z-index: 1;
  /* border: 3px solid orange; */
  @media only screen and (min-width: 960px) {
  }
`;

const TopToolbar = styled.div`
  display: flex;
  margin-top: 1rem;
  justify-content: space-between;
  width: 100%;
  /* border: 3px solid hotpink; */
`;

const WorkoutType = styled.div`
  display: flex;
  justify-content: center;
  text-decoration: none;
  color: white;
  font-size: 1.4rem;
  border-radius: 10px;
  background-color: #355c7d;
  width: 8rem;
  /* border: 3px solid yellow; */
  @media only screen and (min-width: 960px) {
    padding: 1rem;
  }
`;

const ModelContainer = styled.div`
  display: flex;
  width: 100%;
  /* border: 3px solid black; */
  flex-direction: column;
  align-items: center;

  @media only screen and (min-width: 960px) {
    padding: 1rem;
    margin: 1rem;
    width: 90%;
  }

  @media only screen and (min-width: 1200px) {
    padding: 1rem;
    margin: 1rem;
    width: 80%;
    flex-direction: space-around;
  }
  @media only screen and (min-width: 1750px) {
    padding: 1rem;
    width: 80%;
    flex-direction: space-around;
  }
`;

const Webcam = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 100rem;
  margin-top: 1rem;
  /* border: 3px solid green; */
  @media only screen and (min-width: 960px) {
  }
`;
const LabelContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  /* border: 3px dotted orange; */
  border-radius: 1rem;
  background-color: #f9a26c;
  margin-top: 1rem;
  height: 20rem;
  width: 100%;

  @media only screen and (min-width: 960px) {
    display: none;
  }
`;
const LabelContainerLarge = styled.div`
  display: none;
  @media only screen and (min-width: 960px) {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    /* border: 3px dotted orange; */
    border-radius: 1rem;
    background-color: #f9a26c;
    margin-top: 1rem;
    margin-left: 1rem;
    min-width: 8rem;
    width: 100%;
  }
`;

const Label = styled.div`
  color: white;
  font-size: 1.2rem;
`;

const WebcamToolbar = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 3px dotted grey;
  @media only screen and (min-width: 1400px) {
    flex-direction: row;
  }
`;

const Button = styled.button`
  text-decoration: none;
  color: white;
  font-size: 1.4rem;
  border-radius: 10px;
  background-color: #f67280;
  border: 0px;
  width: 7rem;
  margin-top: 1rem;
  padding: 0.3rem 0 0.3rem 0;
  /* align-self: flex-end; */
  width: 100%;
  @media only screen and (min-width: 960px) {
    font-size: 1.3rem;
    width: 25%;
  }
`;

const WebcamDataContainer = styled.div`
  display: flex;
  width: 100%;
  border: 3px solid black;
  @media only screen and (min-width: 960px) {
  }
`;

const RemainingRepCount = styled.h2`
  color: orange;
  padding-top: 0.8rem;
`;
