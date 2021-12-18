import "./App.css";
import { useRef } from "react";
import Header from "./components/Header/Header";

function App() {
  const audioEl = useRef();
  const audioContext = new AudioContext();

  return (
    <div className="App">
      <Header />
      <audio ref={audioEl} />
    </div>
  );
}

export default App;
