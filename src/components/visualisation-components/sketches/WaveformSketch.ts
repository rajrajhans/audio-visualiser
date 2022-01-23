import { P5Instance } from "react-p5-wrapper";
import drawPolygon from "../../../utils/drawPolygon";
import {
  SingleCanvasDimensions,
  SingleCanvasDimensionsMobile,
} from "../../../data/constants";
import isDeviceMobile from "../../../utils/isDeviceMobile";

const waveformSketch = (p5: P5Instance) => {
  let analyserNode: AnalyserNode;
  let analyserData: Float32Array;

  let canvasWidth: number, canvasHeight: number;

  if (isDeviceMobile()) {
    canvasWidth = SingleCanvasDimensionsMobile.Width;
    canvasHeight = SingleCanvasDimensionsMobile.Height;
  } else {
    canvasWidth = SingleCanvasDimensions.Width;
    canvasHeight = SingleCanvasDimensions.Height;
  }

  p5.setup = () => p5.createCanvas(canvasWidth, canvasHeight);

  p5.updateWithProps = (props) => {
    if (props.analyserNode) {
      analyserNode = props.analyserNode;
      analyserData = new Float32Array(analyserNode.fftSize);
    }
  };

  p5.draw = () => {
    if (analyserNode) {
      p5.background(0, 0, 0);
      p5.noFill();
      p5.stroke("white");

      analyserNode.getFloatTimeDomainData(analyserData);

      p5.beginShape();

      for (let i = 0; i < analyserData.length; i++) {
        const amplitude = analyserData[i];

        const extrapolatedYAxisCoords = p5.map(
          amplitude,
          -1,
          1,
          p5.height / 2 - p5.height / 4,
          p5.height / 2 + p5.height / 4
        );

        const extrapolatedXAxisCoords = p5.map(
          i,
          0,
          analyserData.length - 1,
          0,
          p5.width
        );

        p5.vertex(extrapolatedXAxisCoords, extrapolatedYAxisCoords);
      }
      p5.endShape();
    } else {
      p5.fill("white");
      p5.noStroke();
      // Draw a play button
      const dim = p5.min(p5.width, p5.height);
      drawPolygon(p5, p5.width / 2, p5.height / 2, dim * 0.1, 3);
    }
  };
};

export default waveformSketch;
