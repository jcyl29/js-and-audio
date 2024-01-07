const button1 = document.getElementById("button1");
let audio1 = new Audio("sample.mp3");

const container = document.getElementById("container");
const canvas = document.getElementById("canvas1");
const file = document.getElementById("fileupload");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const canvasCtx = canvas.getContext("2d");

let audioSource;
let analyser;

container.addEventListener("click", function () {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  console.log(audioCtx);
  audio1.play();
  audioSource = audioCtx.createMediaElementSource(audio1);

  analyser = audioCtx.createAnalyser();
  audioSource.connect(analyser);
  analyser.connect(audioCtx.destination);
  // FFT Size Must be a power of 2 between 2^5 and 2^15, so one of:
  // 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, and 32768. Defaults to 2048.
  // the larger the number, the smaller the width of the bars
  analyser.fftSize = 256;
  const bufferLength = analyser.frequencyBinCount; // always half of fftsize

  const dataArray = new Uint8Array(bufferLength);
  //
  // const barWidth = canvas.width / 2 / bufferLength;

  // this is a cool number with my sample
  const barWidth = 15
  let barHeight;

  function animate() {
    let x = 0;
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
    analyser.getByteFrequencyData(dataArray);
    drawVisualizer(bufferLength, x, barWidth, barHeight, dataArray);
    requestAnimationFrame(animate);
  }
  animate();
});

file.addEventListener("change", function () {
  const files = this.files;
  const audio1 = document.getElementById("audio1");
  audio1.src = URL.createObjectURL(files[0]);
  audio1.load();
  audio1.play();
});

function drawVisualizer(bufferLength, x, barWidth, barHeight, dataArray) {
  for (let i = 0; i < bufferLength; i++) {
    // barHeight = dataArray[i] * 1.5;

    // this will add a fixed cirular disc in the animation
    barHeight = dataArray[i] * 1.5 + 30;
    canvasCtx.save();
    canvasCtx.translate(canvas.width / 2, canvas.height / 2); // changes the center point

    // the higher the number, the more the spiral will rotate on itself
    canvasCtx.rotate((i * (Math.PI * 1000)) / bufferLength);

    const hue = i * 6

    // The hsl() functional notation expresses an sRGB color according to its
    // hue, saturation, and lightness components
    // https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/hsl
    canvasCtx.fillStyle = `hsl(${hue} 100% 50%)`;
    // canvasCtx.fillStyle = `hsl(${hue} 100% ${barHeight/3}%)`;
    canvasCtx.fillRect(0, 0, barWidth, barHeight);
    x += barWidth;
    canvasCtx.restore();
  }
}
