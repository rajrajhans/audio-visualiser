import React, { createContext, useState, useContext } from "react";

interface GlobalStateInterface {
  selectedMusic: string;
  audioSource: AudioSource;
  userUploadedMusic: string | ArrayBuffer | null;
  changeSelectedMusic: (selectedMusic: string) => void;
  changeUserUploadedMusic: (
    userUploadedMusic: string | ArrayBuffer | null
  ) => void;
  setAudioSource: (audioSource: AudioSource) => void;
}

export enum AudioSource {
  UserUploadedAudio = "UserUploadedMusic",
  SelectedAudio = "SelectedAudio",
}

const initialGlobalState = {
  selectedMusic: "default",
  userUploadedMusic: null,
  audioSource: AudioSource.SelectedAudio,
  changeSelectedMusic: () => {},
  changeUserUploadedMusic: () => {},
  setAudioSource: () => {},
};

const GlobalStateContext =
  createContext<GlobalStateInterface>(initialGlobalState);

export const GlobalStateProvider = ({ children }: any) => {
  const [selectedMusic, setSelectedMusic] = useState<string>("default");
  const [userUploadedMusic, setUserUploadedMusic] = useState<
    string | ArrayBuffer | null
  >(null);
  const [audioSource, setAudioSource] = useState<AudioSource>(
    AudioSource.SelectedAudio
  );

  const changeSelectedMusic = (selectedMusic: string) => {
    setSelectedMusic(selectedMusic);
  };

  const changeUserUploadedMusic = (music: string | ArrayBuffer | null) => {
    setUserUploadedMusic(music);
  };

  return (
    <GlobalStateContext.Provider
      value={{
        changeSelectedMusic,
        selectedMusic,
        userUploadedMusic,
        changeUserUploadedMusic,
        audioSource,
        setAudioSource,
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalStateContext = () => useContext(GlobalStateContext);
