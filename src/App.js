import "./App.css";
import { useRef } from "react";
import Header from "./components/Header/Header";
import AudioSelector from "./components/AudioSelector/AudioSelector";

function App() {
  const audioEl = useRef();
  const audioContext = new AudioContext();

  return (
    <div className="App">
      <Header />
      <AudioSelector />
      <audio ref={audioEl} />
    </div>
  );
}

export default App;
