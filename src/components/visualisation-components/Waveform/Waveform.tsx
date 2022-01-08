import React, { useEffect, useRef } from "react";
import { P5Instance, ReactP5Wrapper } from "react-p5-wrapper";
import drawPolygon from "../../../utils/drawPolygon";

interface WaveformProps {
  audioContext: AudioContext | null;
  audioBuffer: AudioBuffer | null;
}

const sketch = (p5: P5Instance) => {
  let analyserNode: AnalyserNode;
  let analyserData: Float32Array;

  p5.setup = () => p5.createCanvas(500, 500);

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
        p5.endShape();
      }
    } else {
      p5.fill("white");
      p5.noStroke();
      // Draw a play button
      const dim = p5.min(p5.width, p5.height);
      drawPolygon(p5, p5.width / 2, p5.height / 2, dim * 0.1, 3);
    }
  };
};

const Waveform = ({ audioContext, audioBuffer }: WaveformProps) => {
  const gainNodeRef = useRef<GainNode | null>(null);
  const analyserNodeRef = useRef<AnalyserNode | null>(null);
  const analyserDataRef = useRef<Float32Array>(new Float32Array());

  const setupNodes = () => {
    if (!gainNodeRef.current) {
      if (audioContext) {
        gainNodeRef.current = audioContext.createGain();
      }
    }

    if (!analyserNodeRef.current) {
      if (audioContext) {
        analyserNodeRef.current = audioContext.createAnalyser();
        analyserDataRef.current = new Float32Array(
          analyserNodeRef.current.fftSize
        );
        gainNodeRef.current?.connect(analyserNodeRef.current);
        gainNodeRef.current?.connect(audioContext.destination);
      }
    }
  };

  useEffect(() => {
    setupNodes();
    console.log("x");
  }, [audioContext, audioBuffer]);

  const onPlay = async () => {
    if (audioContext && audioBuffer && gainNodeRef.current) {
      await audioContext.resume();
      const audioBufferSourceNode = audioContext.createBufferSource();
      audioBufferSourceNode.connect(gainNodeRef.current);
      audioBufferSourceNode.buffer = audioBuffer;
      audioBufferSourceNode.start(0);
      if (analyserNodeRef.current) {
        analyserNodeRef.current.getFloatTimeDomainData(analyserDataRef.current);
      }
    } else {
      await setupNodes();
      onPlay();
      alert("There was an error in setting up Audio Context");
    }
  };

  return (
    <div>
      <button onClick={onPlay}>Do stuff</button>
      <ReactP5Wrapper sketch={sketch} analyserNode={analyserNodeRef.current} />
    </div>
  );
};

export default Waveform;
