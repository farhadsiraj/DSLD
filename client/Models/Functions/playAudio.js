async function playAudio(audio) {
  let sound;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
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

export default playAudio;
