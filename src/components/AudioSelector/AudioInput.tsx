import {
  AudioSource,
  useGlobalStateContext,
} from "../../data/GlobalStateProvider";
import React from "react";
import styles from "./AudioSelector.module.scss";

export const AudioInput = () => {
  const { changeUserUploadedMusic, setAudioSource, changeSelectedMusic } =
    useGlobalStateContext();

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
    changeSelectedMusic("default");
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
