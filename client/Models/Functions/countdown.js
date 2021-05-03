import { playAudio } from './';
import countdownTone from '../../../public/assets/audio/countdown_F.mp3';
import countdownEndTone from '../../../public/assets/audio/countdownEnd_F.mp3';

let counter;
function countdown(time, callback, val) {
  let countdownSeconds = document.getElementById('timer');
  countdownSeconds.innerHTML = time;
  counter = setInterval(() => {
    time--;
    playAudio(countdownTone);
    countdownSeconds.innerHTML = time;
    if (time === 0) {
      countdownSeconds.innerHTML = 'Active';
      playAudio(countdownEndTone);
      clearInterval(counter);
      callback(val);
    }
  }, 1000);
  return counter;
}

export default countdown;
