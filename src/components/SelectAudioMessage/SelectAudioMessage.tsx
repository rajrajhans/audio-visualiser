import React from "react";
import styles from "./SelectAudioMessage.module.scss";
import { ReactComponent as Illustration } from "../../assets/select-audio.svg";

interface SelectAudioMessageProps {
  isVisible: boolean;
}

const SelectAudioMessage = ({ isVisible }: SelectAudioMessageProps) => {
  if (isVisible) {
    return (
      <div className={styles.selectAudio}>
        <Illustration />
        Please select from one of the available audios from the dropdown, or
        upload your own.
      </div>
    );
  } else {
    return null;
  }
};

export default SelectAudioMessage;
