import React, { useEffect, useRef, useState } from "react";

interface WaveformProps {
  audioContext: AudioContext | null;
  audioBuffer: AudioBuffer | null;
}

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
    </div>
  );
};

export default Waveform;
