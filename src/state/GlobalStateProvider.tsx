import React, { createContext, useState, useContext, useEffect } from "react";
import piano from "../assets/sample_audios/piano.mp3";
import sample_audios from "../components/AudioSelector/sample_audios";

interface GlobalStateInterface {
  audioContext: AudioContext | null;
  audioBuffer: AudioBuffer | null;
  selectedMusic: string;
  changeSelectedMusic: (selectedMusic: string) => void;
}

const defaultAudio = sample_audios[0].path;

const initialGlobalState = {
  audioContext: null,
  audioBuffer: null,
  selectedMusic: defaultAudio,
  changeSelectedMusic: () => {},
};

const GlobalStateContext =
  createContext<GlobalStateInterface>(initialGlobalState);

export const GlobalStateProvider = ({ children }: any) => {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [selectedMusic, setSelectedMusic] = useState<string>(defaultAudio);

  useEffect(() => {
    const setupDeps = async () => {
      await setupWebAudio();
    };
    setupDeps();
  }, []);

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

  const changeSelectedMusic = (selectedMusic: string) => {
    setSelectedMusic(selectedMusic);
  };

  return (
    <GlobalStateContext.Provider
      value={{ audioBuffer, audioContext, changeSelectedMusic, selectedMusic }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalStateContext = () => useContext(GlobalStateContext);
