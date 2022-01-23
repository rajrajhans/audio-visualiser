import { P5Instance } from "react-p5-wrapper";
import drawPolygon from "../../../utils/drawPolygon";
import { SingleCanvasDimensions } from "../../../data/constants";
import getRootMeanSquaredOfSignals from "../../../utils/getRootMeanSquaredOfSignals";

const VolumeMeterSketch = (p5: P5Instance) => {
  let analyserNode: AnalyserNode;
  let analyserData: Float32Array;

  p5.setup = () =>
    p5.createCanvas(
      SingleCanvasDimensions.Width,
      SingleCanvasDimensions.Height
    );

  p5.updateWithProps = (props) => {
    if (props.analyserNode) {
      analyserNode = props.analyserNode;
      analyserNode.smoothingTimeConstant = 1;

      analyserData = new Float32Array(analyserNode.fftSize);
    }
  };

  p5.draw = () => {
    const dim = p5.min(p5.width, p5.height);

    if (analyserNode) {
      analyserNode.getFloatTimeDomainData(analyserData);
      const signal = getRootMeanSquaredOfSignals(analyserData);
      const scale = 5; // signal is of range [0,1]. we will scale it so that circle is visible
      const diameter = dim * scale * signal;

      p5.background(0, 0, 0);
      p5.noFill();
      p5.stroke("white");
      p5.strokeWeight(dim * 0.0075);
      p5.circle(p5.width / 2, p5.height / 2, diameter);
    } else {
      p5.fill("white");
      p5.noStroke();
      // Draw a play button
      const dim = p5.min(p5.width, p5.height);
      drawPolygon(p5, p5.width / 2, p5.height / 2, dim * 0.1, 3);
    }
  };
};

export default VolumeMeterSketch;
