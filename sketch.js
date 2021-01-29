import p5 from 'p5'
import ml5 from 'ml5'

const videoSketch = (sketch) => {
  let poseNet
  let noseX = 0
  let noseY = 0
  let eyelX = 0
  let eyelY = 0
  let video
  let windowHeight = window.innerHeight
  let windowWidth = window.innerWidth

  sketch.setup = () => {
    sketch.createCanvas(windowWidth, windowHeight)
    console.log('setup called')
    video = sketch.createCapture(sketch.VIDEO)
    console.log('before resize-->', video)
    video.size(windowWidth, windowHeight)
    console.log('AFTER RESIZE---->', video.height)
    // console.log(video.elt.attributes[3].nodeValue)
    // console.log(video.height())
    video.hide()
    poseNet = ml5.poseNet(video, modelReady)
    poseNet.on('pose', gotPoses)
  }

  console.log('running')

  function gotPoses(poses) {
    // console.log(poses);
    if (poses.length > 0) {
      let nX = poses[0].pose.keypoints[0].position.x
      let nY = poses[0].pose.keypoints[0].position.y
      let eX = poses[0].pose.keypoints[1].position.x
      let eY = poses[0].pose.keypoints[1].position.y
      noseX = sketch.lerp(noseX, nX, 0.1)
      noseY = sketch.lerp(noseY, nY, 0.1)
      eyelX = sketch.lerp(eyelX, eX, 0.1)
      eyelY = sketch.lerp(eyelY, eY, 0.1)
    }
  }

  function modelReady() {
    console.log('model ready')
  }

  sketch.draw = () => {
    sketch.background(0)
    sketch.circle(100, 100, 100)
    sketch.image(video, 0, 0)

    let d = sketch.dist(noseX, noseY, eyelX, eyelY)

    sketch.fill(255, 0, 0)
    sketch.ellipse(noseX, noseY, d)
    //fill(0,0,255);
    //ellipse(eyelX, eyelY, 50);
  }
}

const sketchInstance = new p5(videoSketch)
