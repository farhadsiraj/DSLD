import React from 'react'
import ReactDOM from 'react-dom'
import * as tf from '@tensorflow/tfjs-core'
import * as tmPose from '@teachablemachine/pose'
import Home from './components/Home'
import positiveFeedback from '../public/audio/positiveFeedback.mp3'
import negativeFeedback from '../public/audio/negativeFeedback.mp3'

// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/pose

// the link to your model provided by Teachable Machine export panel
const URL = 'https://teachablemachine.withgoogle.com/models/c0TmxXpy4/'
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
}


let predictStatus = 'active';

async function loop(timestamp) {
  webcam.update(); // update the webcam frame

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
  window.requestAnimationFrame(loop);
}

// Initialize vars for repCount
let repCount = 0
let startingPosition
let endingPosition
let counterStatus = 'pending'

async function predict(bool) {
  if (bool === true) {
    // Prediction #1: run input through posenet
    // estimatePose can take in an image, video or canvas html element
    const { pose, posenetOutput } = await model.estimatePose(webcam.canvas);
    // Prediction 2: run input through teachable machine classification model
    const prediction = await model.predict(posenetOutput);

    for (let i = 0; i < maxPredictions; i++) {
      const classPrediction =
        prediction[i].className + ': ' + prediction[i].probability.toFixed(2);
      labelContainer.childNodes[i].innerHTML = classPrediction;
    }

    // finally draw the poses
    drawPose(pose);

    startingPosition = prediction[0].probability;
    endingPosition = prediction[1].probability;

    if (counterStatus === 'pending' && startingPosition > 0.9) {
      console.log('Step 1');
      counterStatus = 'active';
    }

    // if (counterStatus === 'active' && endingPosition < 0.7) {
    //   console.log('Step 2');
    //   counterStatus = 'fail';
    // }

    if (counterStatus === 'active' && endingPosition > 0.9) {
      console.log('Step 3');
      counterStatus = 'success';
    }

    if (counterStatus === 'success' && startingPosition > 0.9) {
      console.log('Step 4');
      repCount = repCount + 1;
      playAudio(positiveFeedback);
      counterStatus = 'pending';
    }

    // if (counterStatus === 'fail' && startingPosition > 0.9) {
    //   console.log('Step 5');

    //   // playAudio(negativeFeedback);
    //   counterStatus = 'pending';
    // }


    console.log(counterStatus);

    let repContainer = document.getElementById('rep-container');
    repContainer.innerHTML = repCount;

    // console.log('counterStatus ---->', counterStatus);
    // console.log('In func repCount ---->', repCount);
  } else {
    return;
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
  console.log(predictStatus);
  if (predictStatus === 'pending') {
    predictStatus = 'active';
  } else if (predictStatus === 'active') {
    predictStatus = 'pending';
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

function Model() {
  return (
    <div>
      <button onClick={() => init()}>Start!</button>
      <div>
        <canvas id="canvas"></canvas>
        <div id="label-container"></div>
        <div id="rep-container"></div>
      </div>
      <button id="togglePredict" onClick={() => togglePredict()}>
        Toggle
      </button>
    </div>
  )
}

ReactDOM.render(<Home />, document.getElementById('app'))
