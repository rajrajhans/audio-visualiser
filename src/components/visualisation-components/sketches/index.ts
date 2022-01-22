import waveformSketch from "./WaveformSketch";
import { P5Instance } from "react-p5-wrapper";

export interface SketchObject {
  name: string;
  sketch: (p5: P5Instance) => void;
}

const Sketches: SketchObject[] = [
  {
    name: "Waveform",
    sketch: waveformSketch,
  },
];

export default Sketches;
