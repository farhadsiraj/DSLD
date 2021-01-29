import p5 from 'p5';
import ml5 from 'ml5';

const videoSketch = async (sketch) => {
  let poseNet;
  let noseX = 0;
  let noseY = 0;
  let eyelX = 0;
  let eyelY = 0;
  let video;
  let windowHeight = window.innerHeight;
  let windowWidth = window.innerWidth;

  async function getVideoStream() {
    let vidStream = await navigator.mediaDevices.getUserMedia({ video: true });
    console.log(vidStream);
    let width = await vidStream.getVideoTracks()[0].getSettings().width;
    let height = await vidStream.getVideoTracks()[0].getSettings().height;
    return { width: width, height: height };
  }

  console.log(await getVideoStream());
  //1) we have camera input iV --> cannot change camera input size
  //2) need to manipulate our video dimensions to fit onto our screen: req: window dimensions
  //3) need to manipulate our video dimensions to play nice with our camera input: req: camera dimensions
  //4) canvas(skeleton overlay) --> proportional to video dimension, matches

  //video proportional to camera
  //video dimensions as as a function of window size, but never exceed
  //canvas equal to video

  sketch.setup = () => {
    sketch.createCanvas(windowWidth, windowHeight);
    console.log('setup called');
    video = sketch.createCapture(sketch.VIDEO);
    console.log('before resize-->', video);
    console.log('AFTER RESIZE---->', video.height);
    video.hide();
    poseNet = ml5.poseNet(video, modelReady);
    poseNet.on('pose', gotPoses);
  };

  console.log('running');

  function gotPoses(poses) {
    // console.log(poses);
    if (poses.length > 0) {
      let nX = poses[0].pose.keypoints[0].position.x;
      let nY = poses[0].pose.keypoints[0].position.y;
      let eX = poses[0].pose.keypoints[1].position.x;
      let eY = poses[0].pose.keypoints[1].position.y;
      noseX = sketch.lerp(noseX, nX, 0.1);
      noseY = sketch.lerp(noseY, nY, 0.1);
      eyelX = sketch.lerp(eyelX, eX, 0.1);
      eyelY = sketch.lerp(eyelY, eY, 0.1);
    }
  }

  function modelReady() {
    console.log('model ready');
  }

  sketch.draw = () => {
    sketch.background(0);
    sketch.circle(100, 100, 100);
    sketch.image(video, 0, 0);

    let d = sketch.dist(noseX, noseY, eyelX, eyelY);

    sketch.fill(255, 0, 0);
    sketch.ellipse(noseX, noseY, d);
    //fill(0,0,255);
    //ellipse(eyelX, eyelY, 50);
  };
};

const sketchInstance = new p5(videoSketch);
