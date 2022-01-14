import React, { useEffect, useRef } from "react";
import { ReactP5Wrapper } from "react-p5-wrapper";
import { useGlobalStateContext } from "../../state/GlobalStateProvider";
import sketch from "./sketches/WaveformSketch";

let audioContext = new AudioContext();

const AudioVisCanvas = () => {
  const { selectedMusic } = useGlobalStateContext();

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
  }, [selectedMusic]);

  const onPlay = async () => {
    const resp = await fetch(selectedMusic);
    const buf = await resp.arrayBuffer();
    const audioBuffer: AudioBuffer = await audioContext.decodeAudioData(buf);

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

export default AudioVisCanvas;
