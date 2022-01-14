import "./App.css";
import { useRef } from "react";
import Header from "./components/Header/Header";
import AudioSelector from "./components/AudioSelector/AudioSelector";
import AudioVisCanvas from "./components/visualisation-components/AudioVisCanvas";

function App() {
  const audioEl = useRef<HTMLAudioElement | null>(null);

  return (
    <div className="App">
      <Header />
      <AudioSelector />
      <AudioVisCanvas />
      <audio ref={audioEl} />
    </div>
  );
}

export default App;
