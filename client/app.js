import React, { useRef, Component } from 'react'
import ReactDOM from 'react-dom'
import * as tf from '@tensorflow/tfjs'
import * as posenet from '@tensorflow-models/posenet'
import Webcam from 'react-webcam'

function App() {
  const webCamRef = useRef(null)
  const canvasRef = useRef(null)

  const runPosenet = async () => {
    const net = await posenet.load({
      inputResolution: { width: 640, height: 480 },
      scale: 0.5,
    })
  }

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
