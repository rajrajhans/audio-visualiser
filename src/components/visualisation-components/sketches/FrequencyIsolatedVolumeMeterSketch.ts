import { P5Instance } from "react-p5-wrapper";
import { SingleCanvasDimensions } from "../../../data/constants";
import getRootMeanSquaredOfSignals from "../../../utils/getRootMeanSquaredOfSignals";

interface FrequencyIsolatedSignal {
  color: string;
  analyserNode: AnalyserNode;
  filterNode: BiquadFilterNode;
  FFTData: Float32Array;
}

const FrequencyIsolatedVolumeMeterSketch = (p5: P5Instance) => {
  let gainNode: GainNode;
  let audioContext: AudioContext;
  let signals: FrequencyIsolatedSignal[];

  p5.setup = () =>
    p5.createCanvas(
      SingleCanvasDimensions.Width,
      SingleCanvasDimensions.Height
    );

  p5.updateWithProps = (props) => {
    if (props.audioContext && props.gainNode) {
      gainNode = props.gainNode;

      audioContext = props.audioContext;
      signals = frequencyBandsWithColor.map(({ frequency, color }) => {
        const analyserNode = audioContext.createAnalyser();

        analyserNode.smoothingTimeConstant = 1;

        const FFTData = new Float32Array(analyserNode.fftSize);

        const filterNode = audioContext.createBiquadFilter(); // creating a filter that will only allow a band of data through
        filterNode.frequency.value = frequency;
        filterNode.Q.value = 1; // quality factor
        filterNode.type = "bandpass";

        gainNode.connect(filterNode);
        filterNode.connect(analyserNode);

        return {
          analyserNode,
          color,
          FFTData,
          filterNode,
        };
      });
    }
  };

  p5.draw = () => {
    const dim = p5.min(p5.width, p5.height);
    p5.background("black");

    if (signals) {
      signals.forEach(({ analyserNode, filterNode, FFTData, color }, i) => {
        // get the time domain data for particular analyser node (so it will be filtered data)
        analyserNode.getFloatTimeDomainData(FFTData);

        // get rms of filtered data
        const signalStrength = getRootMeanSquaredOfSignals(FFTData);
        const scale = 5;
        const rectHeight = dim * scale * signalStrength;

        // draw the corresponding rectangle
        p5.fill(color);
        p5.noStroke();
        p5.rectMode(p5.CENTER);
        const margin = 0.2 * dim;
        const rectStartXCoord =
          signals.length <= 1
            ? p5.width / 2
            : p5.map(i, 0, signals.length - 1, margin, p5.width - margin);
        const rectStartYCoord = p5.height / 2;
        const rectWidth =
          ((p5.width - margin * 2) / (signals.length - 1)) * 0.75;
        p5.rect(rectStartXCoord, rectStartYCoord, rectWidth, rectHeight);
      });
    }
  };
};

const frequencyBandsWithColor = [
  // Isolating Frequency Bands and assigning them a color
  { frequency: 55, color: "#7F3CAC" },
  { frequency: 110, color: "#C41D98" },
  { frequency: 220, color: "#22A722" },
  { frequency: 440, color: "#FC4376" },
  { frequency: 570, color: "#00C2AA" },
  { frequency: 960, color: "#F4CD00" },
  { frequency: 2000, color: "#3E58E2" },
  { frequency: 4000, color: "#F391C7" },
];

export default FrequencyIsolatedVolumeMeterSketch;
