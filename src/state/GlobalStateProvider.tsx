import React, { createContext, useState, useContext } from "react";

interface GlobalStateInterface {
  selectedMusic: string;
  changeSelectedMusic: (selectedMusic: string) => void;
}

const initialGlobalState = {
  selectedMusic: "default",
  changeSelectedMusic: () => {},
};

const GlobalStateContext =
  createContext<GlobalStateInterface>(initialGlobalState);

export const GlobalStateProvider = ({ children }: any) => {
  const [selectedMusic, setSelectedMusic] = useState<string>("default");

  const changeSelectedMusic = (selectedMusic: string) => {
    setSelectedMusic(selectedMusic);
  };

  return (
    <GlobalStateContext.Provider value={{ changeSelectedMusic, selectedMusic }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalStateContext = () => useContext(GlobalStateContext);
