import waveformSketch from "./WaveformSketch";
import { P5Instance } from "react-p5-wrapper";
import VolumeMeterSketch from "./VolumeMeterSketch";
import FrequencyIsolatedVolumeMeterSketch from "./FrequencyIsolatedVolumeMeterSketch";

export interface SketchObject {
  name: string;
  sketch: (p5: P5Instance) => void;
}

const Sketches: SketchObject[] = [
  {
    name: "Waveform",
    sketch: waveformSketch,
  },
  {
    name: "Volume Meter",
    sketch: VolumeMeterSketch,
  },
  {
    name: "Frequency Isolated Volume Meter",
    sketch: FrequencyIsolatedVolumeMeterSketch,
  },
];

export default Sketches;
