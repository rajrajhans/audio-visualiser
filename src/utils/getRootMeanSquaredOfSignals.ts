// calculate and return the root mean squared value of a set of signals

export default function getRootMeanSquaredOfSignals(data: Float32Array) {
  let rms = 0;
  for (let i = 0; i < data.length; i++) {
    rms += data[i] * data[i];
  }
  return Math.sqrt(rms / data.length);
}
