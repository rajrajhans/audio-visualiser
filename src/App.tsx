import "./App.css";
import { useRef } from "react";
import Header from "./components/Header/Header";
import AudioSelector from "./components/AudioSelector/AudioSelector";
import AudioVisCanvas from "./components/visualisation-components/AudioVisCanvas";
import { useGlobalStateContext } from "./data/GlobalStateProvider";
import SelectAudioMessage from "./components/SelectAudioMessage/SelectAudioMessage";
import Sketches from "./components/visualisation-components/sketches";

function App() {
  const audioEl = useRef<HTMLAudioElement | null>(null);
  const { selectedMusic, userUploadedMusic } = useGlobalStateContext();
  const isAnyAudioSourceAvailable = !(
    selectedMusic === "default" && !userUploadedMusic
  );

  return (
    <div className="App">
      <Header />
      <AudioSelector />
      <div style={{ display: isAnyAudioSourceAvailable ? "block" : "none" }}>
        {Sketches.map((sketch) => (
          <AudioVisCanvas
            key={sketch.name}
            sketch={sketch.sketch}
            name={sketch.name}
          />
        ))}
      </div>
      <SelectAudioMessage isVisible={!isAnyAudioSourceAvailable} />
      <audio ref={audioEl} />
    </div>
  );
}

export default App;
