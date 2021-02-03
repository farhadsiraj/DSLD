import React, { useRef } from 'react';
import ReactDOM from 'react-dom';
import * as tf from '@tensorflow/tfjs';
import * as posenet from '@tensorflow-models/posenet';
import Webcam from 'react-webcam';
import { drawKeypoints, drawSkeleton } from '../ts-utils';

function App() {
  // set up references to our different components (our webcam and our canvas)
  // useRef is a lifecyle function or a react hook
  const webCamRef = useRef(null);
  const canvasRef = useRef(null);

  // this function loads posenet
  const runPosenet = async () => {
    const net = await posenet.load({
      inputResolution: { width: 257, height: 200 },
      scale: 0.5, // Makes model faster but less accurate
    });

    // this is going to continuous to run the posenet model to detect poses
    setInterval(() => {
      detect(net);
    }, 100); // Run Posenet detections every 100ms
  };

  // pass in our posenet model we imported
  const detect = async (net) => {
    // make sure our webcam is up and ready
    if (
      typeof webCamRef.current !== 'undefined' &&
      webCamRef.current !== null &&
      webCamRef.current.video.readyState === 4
    ) {
      // get video properties
      const video = webCamRef.current.video;
      const videoHeight = webCamRef.current.video.videoHeight;
      const videoWidth = webCamRef.current.video.videoWidth;
      // set video width and height
      webCamRef.current.video.width = videoWidth;
      webCamRef.current.video.height = videoHeight;

      // make detections or detect our poses
      const pose = await net.estimateSinglePose(video);
      console.log(pose);

      drawCanvas(pose, video, videoWidth, videoHeight, canvasRef);
    }
  };

  const drawCanvas = (pose, video, videoWidth, videoHeight, canvas) => {
    const ctx = canvas.current.getContext('2d');
    canvas.current.width = videoWidth;
    canvas.current.height = videoHeight;

    drawKeypoints(pose['keypoints'], 0.5, ctx);
    drawSkeleton(pose['keypoints'], 0.5, ctx);
  };

  runPosenet();

  return (
    <div>
      <h1>Hello Posenet</h1>
      <Webcam
        ref={webCamRef}
        style={{
          position: 'absolute',
          marginLeft: 'auto',
          marginRight: 'auto',
          left: 0,
          right: 0,
          textAlign: 'center',
          zindex: 9,
          width: 640,
          height: 480,
        }}
      />
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          marginLeft: 'auto',
          marginRight: 'auto',
          left: 0,
          right: 0,
          textAlign: 'center',
          zindex: 9,
          width: 640,
          height: 480,
        }}
      ></canvas>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('app'));
