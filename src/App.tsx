import "./App.css";
import { useRef } from "react";
import Header from "./components/Header/Header";
import AudioSelector from "./components/AudioSelector/AudioSelector";
import Waveform from "./components/visualisation-components/Waveform/Waveform";

function App() {
  const audioEl = useRef<HTMLAudioElement | null>(null);

  return (
    <div className="App">
      <Header />
      <AudioSelector />
      <Waveform />
      <audio ref={audioEl} />
    </div>
  );
}

export default App;
