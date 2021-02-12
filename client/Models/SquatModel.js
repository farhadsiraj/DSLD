import React, { useEffect, useState } from 'react';
import * as tmPose from '@teachablemachine/pose';
import positiveFeedback from '../../public/assets/audio/positiveFeedback_v1.mp3';
import negativeFeedback from '../../public/assets/audio/negativeFeedback_v1.mp3';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faForward } from '@fortawesome/free-solid-svg-icons';
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
  const history = useHistory();

  loggedIn = auth.currentUser.uid;

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

      // for (let i = 0; i < maxPredictions; i++) {
      //   const classPrediction = `${prediction[i].className}: ${Math.ceil(
      //     prediction[i].probability.toFixed(2) * 100
      //   )}%`;
      //   labelContainer.childNodes[i].innerHTML = classPrediction;
      // }

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

            history.push('/exercise-form');
          } else {
            togglePredict();
            countdown(restTimer, togglePredict);
            reps = totalReps;
          }
        }
      } else {
        console.log('NO MORE SETS');
      }
      if (setCount) {
        let repContainer = document.getElementById('rep-container');
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
      togglePredict();
      predict(false);
      window.cancelAnimationFrame(startAnimation);
      window.cancelAnimationFrame(startAnimation2);
    };
  }, []);

  function countdown(time, callback, val) {
    let seconds = time;
    let countdownSeconds = document.getElementById('timer');
    countdownSeconds.innerHTML = seconds;
    let counter = setInterval(() => {
      seconds--;
      countdownSeconds.innerHTML = seconds;
      if (seconds === 0) {
        countdownSeconds.innerHTML = '00:00';
        clearInterval(counter);
        callback(val);
      }
    }, 1000);
  }

  return (
    <ContentContainer>
      <ModelContainer>
        <TopToolbar>
          <WorkoutType>Squat</WorkoutType>
          <WorkoutType id="timer">00:00</WorkoutType>
        </TopToolbar>
        <Webcam>
          <div id="webcam-container" style={{ display: 'none' }}></div>
          <canvas width="640" height="480" id="canvas"></canvas>
          <WebcamToolbar>
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
            <LabelContainer>
              <Label id="rep-container"></Label>
              <Label id="acc-container"></Label>
              <Label id="set-container"></Label>
              <Label id="rem-reps-container"></Label>
              <Label id="rem-sets-container"></Label>
            </LabelContainer>
          </WebcamToolbar>
        </Webcam>
      </ModelContainer>
    </ContentContainer>
  );
}

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 65px;
  height: 100%;
  z-index: 1;
  border: 3px solid orange;
  @media only screen and (min-width: 960px) {
  }
`;

const TopToolbar = styled.div`
  display: flex;
  margin-top: 1rem;
  justify-content: space-between;
  width: 100%;
  border: 3px solid hotpink;
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
  border: 3px solid yellow;
  @media only screen and (min-width: 960px) {
    padding: 1rem;
  }
`;

const ModelContainer = styled.div`
  display: flex;
  width: 100%;
  border: 3px solid black;
  flex-direction: column;
  align-items: center;

  @media only screen and (min-width: 960px) {
    padding: 1rem;
    width: 80%;
  }

  @media only screen and (min-width: 1200px) {
    padding: 1rem;
    width: 60%;
  }
  @media only screen and (min-width: 1750px) {
    padding: 1rem;
    width: 50%;
  }
`;

const Webcam = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 100rem;
  border: 3px solid green;
  @media only screen and (min-width: 960px) {
  }
`;
const LabelContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  border: 3px dotted orange;
  border-radius: 1rem;
  background-color: #f9a26c;
  margin-top: 1rem;
`;

const Label = styled.div`
  color: white;
  font-size: 1.2rem;
  @media only screen and (min-width: 960px) {
  }
`;

const WebcamToolbar = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 3px dotted grey;
`;

const Button = styled.button`
  text-decoration: none;
  color: white;
  font-size: 1.4rem;
  border-radius: 10px;
  background-color: #f67280;
  border: 0px;
  width: 7rem;
  padding: 0.3rem 0 0.3rem 0;
  align-self: flex-end;
  width: 100%;
  @media only screen and (max-width: 960px) {
    font-size: 1.3rem;
  }
`;
