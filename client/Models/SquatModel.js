import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import * as tf from '@tensorflow/tfjs-core'
import * as tmPose from '@teachablemachine/pose'
import positiveFeedback from '../../public/audio/positiveFeedback.mp3'
import negativeFeedback from '../../public/audio/negativeFeedback.mp3'
import styled from 'styled-components'

// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/pose

// the link to your model provided by Teachable Machine export panel

// Squat v2
// https://teachablemachine.withgoogle.com/models/J5d1HwacC/
// Squat v3
// https://teachablemachine.withgoogle.com/models/gzTttOI1O/

const URL = 'https://teachablemachine.withgoogle.com/models/gzTttOI1O/'
let model, webcam, ctx, labelContainer, maxPredictions

async function init() {
  const modelURL = URL + 'model.json'
  const metadataURL = URL + 'metadata.json'

  // load the model and metadata
  // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
  // Note: the pose library adds a tmPose object to your window (window.tmPose)
  model = await tmPose.load(modelURL, metadataURL)

  maxPredictions = model.getTotalClasses()

  // Convenience function to setup a webcam
  const size = 640
  const flip = true // whether to flip the webcam
  webcam = new tmPose.Webcam(size, size, flip) // width, height, flip
  await webcam.setup() // request access to the webcam
  await webcam.play()

  window.requestAnimationFrame(loop)

  // append/get elements to the DOM
  const canvas = document.getElementById('canvas')
  canvas.width = size
  canvas.height = size
  ctx = canvas.getContext('2d')
  labelContainer = document.getElementById('label-container')
  for (let i = 0; i < maxPredictions; i++) {
    // and class labels
    labelContainer.appendChild(document.createElement('div'))
  }
  // drawPose();
  // setTimeout(window.requestAnimationFrame, 10000, loop);
}

let predictStatus = 'pending'

async function loop(timestamp) {
  webcam.update() // update the webcam frame

  // app starts with prediction active and drawPose using poseNet
  if (predictStatus === 'active') {
    // document.getElementById('togglePredict').innerHTML('Pause');
    await predict(true)
  }
  // when pause button is pressed, drawPose switches to webcam feed
  if (predictStatus === 'pending') {
    drawPose()
    await predict(false)
  }
  window.requestAnimationFrame(loop)
}

// Initialize vars for repCount
let repCount = 0
let startingPosition
let squattingPosition
let middlePosition
let setupPosition
let counterStatus = 'pending'

// function countdown() {
//   let seconds = 10,
//     countdownSeconds = document.getElementById('#countdown');
//   (function countdown() {
//     countdownSeconds.textContent =
//       seconds + ' second' + (seconds == 1 ? '' : 's');
//     if (seconds-- > 0) setTimeout(countdown, 1000);
//   })();
// }

async function predict(bool) {
  if (bool === true) {
    // Prediction #1: run input through posenet
    // estimatePose can take in an image, video or canvas html element
    const { pose, posenetOutput } = await model.estimatePose(webcam.canvas)
    // Prediction 2: run input through teachable machine classification model
    const prediction = await model.predict(posenetOutput)

    for (let i = 0; i < maxPredictions; i++) {
      const classPrediction = `${prediction[i].className}: ${Math.ceil(
        prediction[i].probability.toFixed(2) * 100
      )}%`
      console.log(classPrediction)
      labelContainer.childNodes[i].innerHTML = classPrediction
    }
    // console.log('prediction---->', prediction);

    // finally draw the poses
    drawPose(pose)

    startingPosition = prediction[0].probability
    squattingPosition = prediction[1].probability
    middlePosition = prediction[2].probability
    setupPosition = prediction[3].probability

    if (counterStatus === 'pending' && startingPosition > 0.9) {
      console.log('Step 1')
      counterStatus = 'starting'
    }

    if (counterStatus === 'starting' && middlePosition > 0.5) {
      console.log('Step 2')
      counterStatus = 'middle'
    }

    if (counterStatus === 'middle' && squattingPosition > 0.9) {
      console.log('Step 3')
      counterStatus = 'squatting'
    }

    if (counterStatus === 'squatting' && startingPosition > 0.9) {
      console.log('Step 4')
      console.log('success')
      repCount = repCount + 1
      playAudio(positiveFeedback)
      counterStatus = 'pending'
    }

    if (counterStatus === 'middle' && startingPosition > 0.9) {
      console.log('Step 5')
      console.log('fail')
      playAudio(negativeFeedback)
      counterStatus = 'pending'
    }

    console.log(counterStatus)

    let repContainer = document.getElementById('rep-container')
    repContainer.innerHTML = `Total Reps: ${repCount}`

    // console.log('counterStatus ---->', counterStatus);
    // console.log('In func repCount ---->', repCount);
  } else {
    return
  }
}

function drawPose(pose) {
  if (webcam.canvas) {
    ctx.drawImage(webcam.canvas, 0, 0)
    // draw the keypoints and skeleton
    if (pose) {
      const minPartConfidence = 0.5
      tmPose.drawKeypoints(pose.keypoints, minPartConfidence, ctx)
      tmPose.drawSkeleton(pose.keypoints, minPartConfidence, ctx)
    }
  }
}

// toggles predictStatus
async function togglePredict() {
  console.log(predictStatus)
  if (predictStatus === 'pending') {
    predictStatus = 'active'
  } else if (predictStatus === 'active') {
    predictStatus = 'pending'
  }
}

// let button = 'start';
// function pause() {
//   if (button === 'start') {
//     playAudio(positiveFeedback);
//     // play(yodelBuffer);
//     // beep(15, 0.5, 10000);
//     button = 'stop';
//   } else {
//     button = 'start';
//     playAudio(negativeFeedback);
//     window.requestAnimationFrame(loop);
//   }
//   console.log(button);
// }

let sound

async function playAudio(audio) {
  const context = new AudioContext()
  await window
    .fetch(audio)
    .then((response) => response.arrayBuffer())
    .then((arrayBuffer) => context.decodeAudioData(arrayBuffer))
    .then((audioBuffer) => {
      sound = audioBuffer
    })

  const source = context.createBufferSource()
  source.buffer = sound
  source.connect(context.destination)
  source.start()
}

export function Model() {
  const [isLoading, setIsLoading] = useState(true)
  const [toggleStart, setToggle] = useState(false)

  useEffect(() => {
    init()

    return () => console.log('Model cleaned up.')
  }, [])

  return (
    <Container>
      <Webcam>
        <canvas width="640" height="640" id="canvas"></canvas>
        <WebcamToolbar>
          <Label id="rep-container"></Label>
          <Button
            id="togglePredict"
            onClick={() => {
              togglePredict()
              setToggle(!toggleStart)
            }}
          >
            {toggleStart ? 'Stop' : 'Start'}
          </Button>
        </WebcamToolbar>
      </Webcam>
      <LabelContainer>
        <Label id="label-container"></Label>
        <Label id="countdown"></Label>
      </LabelContainer>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  width: 100%;
  margin: 2rem;

  @media only screen and (max-width: 1200px) {
    flex-direction: column;
  }
`

const Webcam = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`
const LabelContainer = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
`
const Label = styled.div`
  color: #325d79;
  font-size: 3.2rem;
  @media only screen and (max-width: 1200px) {
    font-size: 1.3rem;
  }
`

const WebcamToolbar = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 0.7rem;
`

const Button = styled.button`
  padding: 1rem;
  text-decoration: none;
  color: white;
  font-size: 1.4rem;
  border-radius: 10px;
  background-color: #f67280;
  border: 0px;
  width: 10rem;
`
const Placeholder = styled.div`
  height: 640px;
  width: 640px;
  background-color: pink;
`