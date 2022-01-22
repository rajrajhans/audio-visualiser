import React from "react";
import styles from "./AudioSelector.module.scss";
import { AudioDropdown } from "./AudioDropdown";
import { AudioInput } from "./AudioInput";

const AudioSelector = () => {
  return (
    <div className={styles.audioSelector}>
      <AudioDropdown />

      <div className={styles.or}>OR</div>

      <AudioInput />
    </div>
  );
};

export default AudioSelector;
