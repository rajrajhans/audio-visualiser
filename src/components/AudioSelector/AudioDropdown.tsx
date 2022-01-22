import {
  AudioSource,
  useGlobalStateContext,
} from "../../data/GlobalStateProvider";
import sample_audios from "../../data/sample_audios";
import React from "react";

export const AudioDropdown = () => {
  const { changeSelectedMusic, selectedMusic, setAudioSource } =
    useGlobalStateContext();

  const handleChange = (e: any) => {
    setAudioSource(AudioSource.SelectedAudio);
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
