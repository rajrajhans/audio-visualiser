import React from "react";
import styles from "./AudioSelector.module.scss";
import sample_audios from "./sample_audios";
import { useGlobalStateContext } from "../../state/GlobalStateProvider";

const AudioSelector = () => {
  return (
    <div className={styles.audioSelector}>
      <AudioDropdown />

      <div className={styles.or}>OR</div>

      <AudioInput />
    </div>
  );
};

const AudioDropdown = () => {
  const { changeSelectedMusic, selectedMusic } = useGlobalStateContext();

  const handleChange = (e: any) => {
    changeSelectedMusic(e.target.value);
  };

  return (
    <div>
      <label htmlFor={"audio-dropdown"}>
        Choose from any of the sample audios
      </label>
      <select
        id={"audio-dropdown"}
        value={selectedMusic}
        onChange={handleChange}
      >
        <option value={"default"}>Select an audio</option>

        {sample_audios.map((audio) => (
          <option value={audio.path} key={audio.id}>
            {audio.name}
          </option>
        ))}
      </select>
    </div>
  );
};

const AudioInput = () => (
  <div className={styles.audioInput}>
    <label htmlFor={"audio-input"}>Upload your own audio file</label>
    <input id={"audio-input"} type={"file"} />
  </div>
);

export default AudioSelector;
