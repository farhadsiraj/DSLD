import React from 'react';
import ReactDOM from 'react-dom';
import * as tf from '@tensorflow/tfjs-core';
import * as tmPose from '@teachablemachine/pose';
import useSound from 'use-sound';
import positiveFeedback from '../public/audio/positiveFeedback.mp3';
import negativeFeedback from '../public/audio/negativeFeedback.mp3';

// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/pose

// the link to your model provided by Teachable Machine export panel
const URL = 'https://teachablemachine.withgoogle.com/models/c0TmxXpy4/';
let model, webcam, ctx, labelContainer, maxPredictions;

async function init() {
  const modelURL = URL + 'model.json';
  const metadataURL = URL + 'metadata.json';

  // load the model and metadata
  // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
  // Note: the pose library adds a tmPose object to your window (window.tmPose)
  model = await tmPose.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();

  // Convenience function to setup a webcam
  const size = 640;
  const flip = true; // whether to flip the webcam
  webcam = new tmPose.Webcam(size, size, flip); // width, height, flip
  await webcam.setup(); // request access to the webcam
  await webcam.play();
  window.requestAnimationFrame(loop);

  // append/get elements to the DOM
  const canvas = document.getElementById('canvas');
  canvas.width = size;
  canvas.height = size;
  ctx = canvas.getContext('2d');
  labelContainer = document.getElementById('label-container');
  for (let i = 0; i < maxPredictions; i++) {
    // and class labels
    labelContainer.appendChild(document.createElement('div'));
  }
}
let button = 'start';
async function loop(timestamp) {
  webcam.update(); // update the webcam frame
  await predict();
  if (button === 'start') {
    window.requestAnimationFrame(loop);
  } else {
    if (button === 'stop') {
      window.cancelAnimationFrame(window.requestAnimationFrame(loop));
    }
  }
  // console.log(window.requestAnimationFrame(loop));
}

// Initialize vars for repCount
let repCount = 0;
let startingPosition;
let endingPosition;
let counterStatus = 'pending';

async function predict() {
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
    counterStatus = 'ready';
  }

  if (counterStatus === 'ready' && endingPosition > 0.9) {
    console.log('Step 2');
    counterStatus = 'active';
  }

  if (counterStatus === 'active' && startingPosition > 0.9) {
    console.log('Step 3');
    repCount = repCount + 1;
    counterStatus = 'ready';
  }
  let repContainer = document.getElementById('rep-container');
  repContainer.innerHTML = repCount;

  // console.log('counterStatus ---->', counterStatus);
  // console.log('In func repCount ---->', repCount);
}

function drawPose(pose) {
  if (webcam.canvas) {
    ctx.drawImage(webcam.canvas, 0, 0);
    // draw the keypoints and skeleton
    if (pose) {
      const minPartConfidence = 0.5;
      tmPose.drawKeypoints(pose.keypoints, minPartConfidence, ctx);
      tmPose.drawSkeleton(pose.keypoints, minPartConfidence, ctx);
    }
  }
}

function pause() {
  if (button === 'start') {
    play(yodelBuffer);
    // beep(15, 0.5, 10000);
    button = 'stop';
  } else {
    button = 'start';
    window.requestAnimationFrame(loop);
  }
  console.log(button);
}

// Figure out how this audio code works
// Move the call below to the repCounter
// Two audio contexts, one for positiveFeedback and the other for negativeFeedback
// positiveFeedback plays when a rep is incremented
// negativeFeedback plays when status is start, class4 and then start again
const audioURL = negativeFeedback;

const context = new AudioContext();
//const playButton = document.querySelector('#play');

let yodelBuffer;

window
  .fetch(audioURL)
  .then((response) => response.arrayBuffer())
  .then((arrayBuffer) => context.decodeAudioData(arrayBuffer))
  .then((audioBuffer) => {
    //playButton.disabled = false;
    yodelBuffer = audioBuffer;
  });

//playButton.onclick = () => play(yodelBuffer);

function play(audioBuffer) {
  const source = context.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(context.destination);
  source.start();
}

// let a = new AudioContext(); // browsers limit the number of concurrent audio contexts, so you better re-use'em

// function beep(vol, freq, duration) {
//   let v, u;
//   v = a.createOscillator();
//   u = a.createGain();
//   v.connect(u);
//   v.frequency.value = freq;
//   v.type = 'square';
//   u.connect(a.destination);
//   u.gain.value = vol * 0.01;
//   v.start(a.currentTime);
//   v.stop(a.currentTime + duration * 0.001);
// }

function Model() {
  return (
    <div>
      <button onClick={() => init()}>Start!</button>
      <div>
        <canvas id="canvas"></canvas>
        <div id="label-container"></div>
        <div id="rep-container"></div>
      </div>
      <button onClick={() => pause()}>Pause</button>
    </div>
  );
}

ReactDOM.render(<Model />, document.getElementById('app'));
