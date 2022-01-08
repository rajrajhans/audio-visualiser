import React, { createContext, useState, useContext, useEffect } from "react";
import piano from "../assets/sample_audios/piano.mp3";

interface GlobalStateInterface {
  audioContext: AudioContext | null;
  audioBuffer: AudioBuffer | null;
}

const initialGlobalState = {
  audioContext: null,
  audioBuffer: null,
};

const GlobalStateContext =
  createContext<GlobalStateInterface>(initialGlobalState);

export const GlobalStateProvider = ({ children }: any) => {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);

  const setupWebAudio = async () => {
    if (!audioContext) {
      setAudioContext(new AudioContext());
    }

    if (!audioBuffer) {
      const resp = await fetch(piano);

      // Turn into an array buffer of raw binary data
      const buf = await resp.arrayBuffer();

      // Decode the entire binary MP3 into an AudioBuffer
      const audioContextTemp = audioContext || new AudioContext();
      const audioBufferTemp = await audioContextTemp.decodeAudioData(buf);
      setAudioBuffer(audioBufferTemp);
    }
  };

  useEffect(() => {
    const setupDeps = async () => {
      await setupWebAudio();
    };
    setupDeps();
  }, []);

  return (
    <GlobalStateContext.Provider value={{ audioBuffer, audioContext }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalStateContext = () => useContext(GlobalStateContext);
