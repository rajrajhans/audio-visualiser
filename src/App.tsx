import "./App.css";
import { useRef } from "react";
import Header from "./components/Header/Header";
import AudioSelector from "./components/AudioSelector/AudioSelector";
import Waveform from "./components/visualisation-components/Waveform/Waveform";
import { useGlobalStateContext } from "./state/GlobalStateProvider";

function App() {
  const audioEl = useRef<HTMLAudioElement | null>(null);
  const { audioBuffer, audioContext } = useGlobalStateContext();

  return (
    <div className="App">
      <Header />
      <AudioSelector />
      <Waveform audioBuffer={audioBuffer} audioContext={audioContext} />
      <audio ref={audioEl} />
    </div>
  );
}

export default App;
