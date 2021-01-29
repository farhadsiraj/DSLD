import p5 from 'p5'
import ml5 from 'ml5'

const skeletonSketch = (sketch) => {
  let img
  let video
  let poseNet
  let poses = []

  let lX = 0
  let lY = 0

  sketch.setup = () => {
    sketch.createCanvas(640, 480)

    // create an image using the p5 dom library
    // call imageReady() when it is loaded
    // String: src path or url for image
    // alt String: alternate text to be used if image does not load. You can use also an empty string ("") if that an image is not intended to be viewed.
    // crossOrigin String: crossOrigin property of the img element; use either 'anonymous' or 'use-credentials' to retrieve the image with cross-origin access (for later use with canvas. if an empty string("") is passed, CORS is not used
    // successCallback Function: callback to be called once image data is loaded with the p5.Element as argument (Optional)
    // img = sketch.createImg(
    //   'https://media3.s-nbcnews.com/j/newscms/2018_17/2413576/b_dib_metzl1squat2_170213_40fb12f1c35eacbbde96cd69a7361022.fit-760w.jpg',
    //   'squat',
    //   'anonymous',
    //   imageReady
    // )
    video = sketch.createCapture(sketch.VIDEO)
    video.size(640, 480)

    video.hide()
    // set the image size to the size of the canvas
    // img.size(640, 480)

    // hide the image in the browser
    // img.hide()

    // set the frameRate to 1 since we don't need it to be running quickly in this case
    sketch.frameRate(30)
    poseNet = ml5.poseNet(video, modelReady)
    // This sets up an event that listens to 'pose' events
    poseNet.on('pose', function (results) {
      poses = results
    })
  }

  // // function imageReady() {
  //   // options: OPTIONAL. A object that contains properties that effect the posenet model accuracy, results, etc.
  //   // set some options
  //   const options = {
  //     minConfidence: 0.1,
  //     // Can be one of 161, 193, 257, 289, 321, 353, 385, 417, 449, 481, 513, and 801. Defaults to 257. It specifies the size the image is resized to before it is fed into the PoseNet model. The larger the value, the more accurate the model at the cost of speed. Set this to a smaller value to increase speed at the cost of accuracy.
  //     // inputResolution: { width: 640, height: 480 },
  //   }

  // assign poseNet
  // poseNet = ml5.poseNet(modelReady, options)
  // // This sets up an event that listens to 'pose' events
  // poseNet.on('pose', function (results) {
  //   poses = results
  // })
  // Returns an empty object
  //console.log(poses)
  // }

  // when poseNet is ready, do the detection
  function modelReady() {
    // When the model is ready, run the singlePose() function...
    // If/When a pose is detected, poseNet.on('pose', ...) will be listening for the detection results
    // in the draw() loop, if there are any poses, then carry out the draw commands
    poseNet.singlePose(video)
  }

  if (poses.length > 0) {
    sketch.image(video, 0, 0, 640, 480)
    drawSkeleton(poses)
    drawKeypoints(poses)
    // sketch.noLoop() // stop looping when the poses are estimated
  }

  sketch.draw = () => {
    if (poses.length > 0) {
      sketch.image(video, 0, 0, 640, 480)
      drawSkeleton(poses)
      drawKeypoints(poses)
      // sketch.noLoop() // stop looping when the poses are estimated
    }
  }

  // The following comes from https://ml5js.org/docs/posenet-webcam
  // A function to draw ellipses over the detected keypoints
  function drawKeypoints() {
    // Loop through all the poses detected
    for (let i = 0; i < poses.length; i += 1) {
      // For each pose detected, loop through all the keypoints
      const pose = poses[i].pose
      // console.log(pose)
      for (let j = 0; j < pose.keypoints.length; j += 1) {
        // A keypoint is an object describing a body part (like rightArm or leftShoulder)
        const keypoint = pose.keypoints[j]
        // console.log(keypoint)
        // Only draw an ellipse is the pose probability is bigger than 0.2
        if (keypoint.score > 0.2) {
          let x = keypoint.position.x
          let y = keypoint.position.y

          lX = sketch.lerp(lX, x, 1)
          lY = sketch.lerp(lY, y, 1)

          sketch.fill(255)
          sketch.stroke(20)
          sketch.strokeWeight(4)
          sketch.ellipse(lX, lY, 8)
        }
      }
    }
  }

  // A function to draw the skeletons
  function drawSkeleton() {
    // Loop through all the skeletons detected
    for (let i = 0; i < poses.length; i += 1) {
      const skeleton = poses[i].skeleton
      // For every skeleton, loop through all body connections
      for (let j = 0; j < skeleton.length; j += 1) {
        const partA = skeleton[j][0]
        const partB = skeleton[j][1]
        sketch.stroke(255)
        sketch.strokeWeight(1)
        sketch.line(
          partA.position.x,
          partA.position.y,
          partB.position.x,
          partB.position.y
        )
      }
    }
  }
}

const sketchInstance = new p5(skeletonSketch)
