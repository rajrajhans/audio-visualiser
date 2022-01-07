import React from "react";
import styles from "./Header.module.scss";
import audioWave from "../../assets/audio-wave.png";

const Header = () => {
  return (
    <div className={styles.header}>
      <div className={styles.logo}>
        <img src={audioWave} alt={"Audio Visualiser"} />
        <div className={styles.title}>Audio Visualiser</div>
      </div>

      <div className={styles.blogPostLink}>
        <a>Read the Blog Post</a>
      </div>
    </div>
  );
};

export default Header;
