import React from "react";
import styles from "./AudioSelector.module.scss";
import sample_audios from "./sample_audios";
import {
  AudioSource,
  useGlobalStateContext,
} from "../../data/GlobalStateProvider";

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

const AudioInput = () => {
  const { changeUserUploadedMusic, setAudioSource } = useGlobalStateContext();

  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = function (ev) {
      if (ev.target) {
        changeUserUploadedMusic(ev.target.result);
      }
    };
    reader.readAsArrayBuffer(file);
    setAudioSource(AudioSource.UserUploadedAudio);
  };

  return (
    <div className={styles.audioInput}>
      <label htmlFor={"audio-input"}>Upload your own audio file</label>
      <div className={styles.audioUploadContainer}>
        <input
          id={"audio-input"}
          type={"file"}
          onChange={inputChangeHandler}
          accept=".mp3"
        />
      </div>
    </div>
  );
};

export default AudioSelector;
