import blue_jeans from "../assets/sample_audios/bluejeans.mp3";
import chime from "../assets/sample_audios/chime.mp3";
import piano from "../assets/sample_audios/piano.mp3";

interface SampleAudio {
  id: number;
  name: string;
  path: string;
}

const sample_audios: SampleAudio[] = [
  {
    id: 1,
    name: "Blue Jeans, Lana Del Rey",
    path: blue_jeans,
  },
  {
    id: 2,
    name: "Chime",
    path: chime,
  },
  {
    id: 3,
    name: "Piano",
    path: piano,
  },
];

export default sample_audios;
