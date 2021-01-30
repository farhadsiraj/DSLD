import React, { useRef } from 'react'
import ReactDOM from 'react-dom'
import * as tf from '@tensorflow/tfjs'
import * as posenet from '@tensorflow-models/posenet'
import Webcam from 'react-webcam'
import { drawKeypoints, drawSkeleton } from '../ts-utils'

function App() {
  const webCamRef = useRef(null)
  const canvasRef = useRef(null)

  const runPosenet = async () => {
    const net = await posenet.load({
      inputResolution: { width: 640, height: 480 },
      scale: 0.5, // Makes model faster but less accurate
    })

    setInterval(() => {
      detect(net)
    }, 100) // Run Posenet detections every 100ms
  }

  const detect = async (net) => {
    if (
      typeof webCamRef.current !== 'undefined' &&
      webCamRef.current !== null &&
      webCamRef.current.video.readyState === 4
    ) {
      const video = webCamRef.current.video
      const videoHeight = webCamRef.current.video.videoHeight
      const videoWidth = webCamRef.current.video.videoWidth
      webCamRef.current.video.width = videoWidth
      webCamRef.current.video.height = videoHeight

      const pose = await net.estimateSinglePose(video)
      console.log(pose)

      drawCanvas(pose, video, videoWidth, videoHeight, canvasRef)
    }
  }

  const drawCanvas = (pose, video, videoWidth, videoHeight, canvas) => {
    const ctx = canvas.current.getContext('2d')
    canvas.current.width = videoWidth
    canvas.current.height = videoHeight

    drawKeypoints(pose['keypoints'], 0.5, ctx)
    drawSkeleton(pose['keypoints'], 0.5, ctx)
  }

  runPosenet()

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
  )
}

ReactDOM.render(<App />, document.getElementById('app'))
