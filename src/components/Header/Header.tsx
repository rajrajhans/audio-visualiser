import React from "react";
import styles from "./Header.module.scss";
import audioWave from "../../assets/audio-wave.png";
import githubLogo from "../../assets/github.png";

const Header = () => {
  return (
    <div className={styles.header}>
      <div className={styles.logo}>
        <img src={audioWave} alt={"Audio Visualiser"} />
        <div className={styles.title}>Audio Visualiser</div>
      </div>

      <a
        className={styles.githubLink}
        href={"https://github.com/rajrajhans/audio-visualiser"}
      >
        <img src={githubLogo} />
      </a>
    </div>
  );
};

export default Header;
