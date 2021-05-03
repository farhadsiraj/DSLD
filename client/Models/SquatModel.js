import React, { useEffect, useState } from 'react';
import * as tmPose from '@teachablemachine/pose';
import positiveFeedback from '../../public/assets/audio/positiveFeedback_F.mp3';
import negativeFeedback from '../../public/assets/audio/negativeFeedback_F.mp3';
import countdownTone from '../../public/assets/audio/countdown_F.mp3';
import countdownEndTone from '../../public/assets/audio/countdownEnd_F.mp3';
import styled from 'styled-components';
import { db, auth } from '../../firebase';
import { useHistory } from 'react-router-dom';
import {
  getLifetimeStats,
  setRepPrefs,
  setWorkoutStats,
  updateLifetimeStats,
  countdown,
  playAudio,
} from './Functions';

// needs to be outside of Model function scope to toggle Start/Stop
let loggedIn;
let repCount = 0;
let startingPosition;
let squattingPosition;
let middlePosition;
let setupPosition;
let counterStatus = 'pending';
// let lineColor = '#FFD700';
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
let finalRepCount;

export function Model() {
  const history = useHistory();
  // const [isLoading, setIsLoading] = useState(true);
  const [toggleStart, setToggle] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [countdownId, setCountdownId] = useState(null);
  // const [state, setState] = useState({
  //   repCount: 0,
  //   lifetimeReps: null,
  //   lifetimeSets: null,
  // });
  useEffect(() => {
    init();

    return function cleanup() {
      if (predictStatus === 'active') togglePredict();
      repCount = 0;
      window.cancelAnimationFrame(startAnimation);
      window.cancelAnimationFrame(startAnimation2);
    };
  }, []);

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

    // Get lifetime stats
    [lifetimeReps, lifetimeSets] = await getLifetimeStats();

    // Set workout preferences
    [
      exercise,
      totalReps,
      successfulReps,
      reps,
      totalSets,
      setCount,
      restTimer,
    ] = await setRepPrefs();
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

      startingPosition = prediction[0].probability;
      middlePosition = prediction[1].probability;
      squattingPosition = prediction[2].probability;

      let canvasBorder = document.getElementById('canvas');

      if (setCount > 0) {
        // Checking for Starting Position
        if (counterStatus === 'pending' && startingPosition > 0.9) {
          // lineColor = '#9BD7D1';
          // canvasBorder.style.border = `20px solid ${lineColor}`;
          // drawPose(pose, lineColor);
          counterStatus = 'starting';
        }

        // Transition from Starting to Middle Squat
        if (counterStatus === 'starting' && middlePosition > 0.5) {
          counterStatus = 'middle';
        }

        // Transition from Middle to Full Squat
        if (counterStatus === 'middle' && squattingPosition > 0.9) {
          counterStatus = 'squatting';
        }

        // Successful Full Squat
        if (counterStatus === 'squatting' && startingPosition > 0.9) {
          lineColor = '#39E47E';
          drawPose(pose, lineColor);
          canvasBorder.style.border = `20px solid ${lineColor}`;
          repCount = repCount + 1;
          playAudio(positiveFeedback);
          counterStatus = 'pending';
          reps = reps - 1;
        }

        // Failed Squat (didn't reach to full squat position)
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
        finalRepCount = successfulReps;

        if (reps === 0) {
          setCount = setCount - 1;

          if (setCount === 0) {
            let workout = {
              type: exercise,
              sets: totalSets,
              reps: totalReps,
              accuracy: accuracy,
              successfulReps: successfulReps,
            };

            setWorkoutStats(workout);

            let updateStats = {
              lifetimeReps: parseInt(lifetimeReps) + parseInt(successfulReps),
              lifetimeSets: parseInt(lifetimeSets) + parseInt(totalSets),
            };
            updateLifetimeStats(updateStats);

            counterStatus = 'pending';
            lineColor = '#9BD7D1';

            setModalOpen(!modalOpen);
            togglePredict();
            window.cancelAnimationFrame(startAnimation);
            window.cancelAnimationFrame(startAnimation2);
          } else {
            reps = totalReps;
            togglePredict();
            setCountdownId(countdown(restTimer, togglePredict));
          }
        }
      }

      if (setCount) {
        let repContainer = document.getElementById('rep-container');

        if (repContainer !== null) {
          let setContainer = document.getElementById('set-container');
          let accContainer = document.getElementById('acc-container');
          let remRepsContainer = document.getElementById('rem-reps-container');
          let remSetsContainer = document.getElementById('rem-sets-container');

          repContainer.innerHTML = `Successful Reps: ${repCount}`;
          setContainer.innerHTML = `Total Sets: ${totalSets}`;
          accContainer.innerHTML = `Accuracy: ${accuracy}%`;
          remRepsContainer.innerHTML = `Remaining Reps: ${reps}`;
          remSetsContainer.innerHTML = `Remaining Sets: ${setCount}`;
        }

        let repContainer1 = document.getElementById('rep1-container');

        if (repContainer1 !== null) {
          let setContainer1 = document.getElementById('set1-container');
          let accContainer1 = document.getElementById('acc1-container');
          let remRepsContainer1 = document.getElementById(
            'rem1-reps-container'
          );
          let remSetsContainer1 = document.getElementById(
            'rem1-sets-container'
          );
          repContainer1.innerHTML = `Successful Reps: ${repCount}`;
          setContainer1.innerHTML = `Total Sets: ${totalSets}`;
          accContainer1.innerHTML = `Accuracy: ${accuracy}%`;
          // remRepsContainer1.innerHTML = `Remaining Reps: ${reps}`;
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
    if (predictStatus === 'pending') {
      predictStatus = 'active';
    } else if (predictStatus === 'active') {
      predictStatus = 'pending';
    }
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
                You did {finalRepCount} {exercise}s in {totalSets} sets with an
                accuracy of {accuracy}%.
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
                style={{ backgroundColor: toggleStart ? '#FD374C' : '#6BE19B' }}
                id="togglePredict"
                onClick={() => {
                  if (predictStatus === 'pending' && !toggleStart) {
                    setCountdownId(countdown(10, togglePredict));
                  } else if (predictStatus === 'pending' && toggleStart) {
                    clearInterval(countdownId);
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
                    <Label id="rep-container">
                      Successful Reps: Loading...
                    </Label>
                    <Label id="acc-container">Accuracy: Loading...</Label>
                    <Label id="set-container">Total Sets: Loading...</Label>
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
            <LabelBox>
              {document.getElementById('workout-data-large') ? (
                <>
                  <LabelInnerBox>
                    {' '}
                    <div style={{ padding: '1rem' }}>
                      <LargeLabel id="rep1-container">
                        Successful Reps: Loading...
                      </LargeLabel>
                    </div>
                    <div style={{ padding: '1rem' }}>
                      <LargeLabel id="acc1-container">
                        Accuracy: Loading...
                      </LargeLabel>
                    </div>
                  </LabelInnerBox>

                  <LabelInnerBox>
                    {' '}
                    <div style={{ padding: '1rem' }}>
                      <LargeLabel id="set1-container">
                        Total Sets: Loading...
                      </LargeLabel>
                    </div>
                    <div style={{ padding: '1rem' }}>
                      <LargeLabel id="rem1-sets-container">
                        Remaining Sets: Loading...
                      </LargeLabel>
                    </div>
                  </LabelInnerBox>
                </>
              ) : (
                <LargeLabel style={{ color: 'white' }}>
                  Press Start To Begin
                </LargeLabel>
              )}
            </LabelBox>
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
  z-index: 900;
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
  width: 95%;
  margin-top: 65px;
  height: 100%;
  z-index: 1;
  @media only screen and (min-width: 960px) {
    width: 100%;
  }
`;

const TopToolbar = styled.div`
  display: flex;
  margin-top: 1rem;
  justify-content: space-between;
  width: 100%;
`;

const WorkoutType = styled.div`
  display: flex;
  justify-content: center;
  text-decoration: none;
  color: white;
  font-size: 1rem;
  padding: 0.5rem;
  border-radius: 10px;
  background-color: #355c7d;
  width: 8rem;
  @media only screen and (min-width: 960px) {
    padding: 1rem;
    font-size: 1.4rem;
  }
`;

const ModelContainer = styled.div`
  display: flex;
  width: 100%;
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
  @media only screen and (min-width: 960px) {
  }
`;
const LabelContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  border-radius: 1rem;
  background-color: #f9a26c;
  margin-top: 1rem;
  height: 10rem;
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
    flex-direction: column;
    border-radius: 1rem;
    background-color: #f9a26c;
    margin-top: 1rem;
    margin-left: 1rem;
    min-width: 8rem;
    padding: 1rem;
    width: 70%;
    /* z-index: 800; */
  }
`;

const LabelBox = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2rem;
  border-radius: 1rem;
`;

const LabelInnerBox = styled.h1`
  color: #355c7d;
  font-size: 2rem;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);
  padding: 1rem;
  border-radius: 1rem;
  margin-bottom: 2rem;
`;

const Label = styled.div`
  color: white;
  font-size: 1.2rem;
`;
const LargeLabel = styled.div`
  color: #325d79;
  font-size: 1.2rem;
  @media only screen and (min-width: 1400px) {
    font-size: 2rem;
  }
`;

const WebcamToolbar = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  @media only screen and (min-width: 1400px) {
    flex-direction: row;
    justify-content: space-between;
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
  width: 100%;
  @media only screen and (min-width: 960px) {
    font-size: 1.3rem;
    width: 25%;
  }
`;

const WebcamDataContainer = styled.div`
  display: flex;
  width: 100%;
  @media only screen and (min-width: 960px) {
  }
`;

const RemainingRepCount = styled.h2`
  color: #325d79;
  padding-top: 0.8rem;
  margin: 0;
`;
