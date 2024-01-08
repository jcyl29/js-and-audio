export default class Microphone {
  constructor() {
    this.audioContext = null;
    this.microphone = null;
    this.analyser = null;
    this.dataArray = null;
  }

  async initialize() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.audioContext = new AudioContext();
      this.microphone = this.audioContext.createMediaStreamSource(stream);
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 512;
      const bufferLength = this.analyser.frequencyBinCount;
      this.dataArray = new Uint8Array(bufferLength);
      this.microphone.connect(this.analyser);
      this.initalized = true;
    } catch (err) {
      alert(err);
    }
  }

  getSamples() {
    this.analyser.getByteTimeDomainData(this.dataArray);
    // values will be between -1 and 1
    let normSamples = [...this.dataArray].map((e) => e / 128 - 1);
    return normSamples;
  }

  getVolume() {
    this.analyser.getByteTimeDomainData(this.dataArray);
    // values will be between -1 and 1
    let normSamples = [...this.dataArray].map((e) => e / 128 - 1);
    let sum = 0;
    for (let i = 0; i < normSamples.length; i++) {
      sum += normSamples[i] * normSamples[i];
    }
    let volume = Math.sqrt(sum / normSamples.length);
  }
}
