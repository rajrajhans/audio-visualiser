import React, { useEffect, useRef, useState } from "react";
import { P5Instance, ReactP5Wrapper } from "react-p5-wrapper";
import {
  AudioSource,
  useGlobalStateContext,
} from "../../data/GlobalStateProvider";
import styles from "./AudioVisCanvas.module.scss";
import { SingleCanvasDimensions } from "../../data/constants";

interface AudioVisCanvasProps {
  sketch: (p5: P5Instance) => void;
  name: string;
}

const AudioVisCanvas = ({ sketch, name }: AudioVisCanvasProps) => {
  const { selectedMusic, audioSource, userUploadedMusic } =
    useGlobalStateContext();
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isAudioDownloading, setIsAudioDownloading] = useState(false);
  const gainNodeRef = useRef<GainNode | null>(null);
  const analyserNodeRef = useRef<AnalyserNode | null>(null);

  const audioContext = useRef<AudioContext>(new AudioContext());
  const audioBufferSourceNode = useRef<AudioBufferSourceNode | null>(null);
  const recorder = useRef<MediaRecorder | null>(null);
  const recordedBlobURL = useRef<string | undefined>(undefined);
  const dest = useRef<MediaStreamAudioDestinationNode | null>(null);

  const record = () => {
    let chunks: Blob[] = [];

    chunks.length = 0;
    const selector = "#" + name.replaceAll(" ", "") + "-sketch canvas";
    // @ts-ignore
    let stream = document
      .querySelector(selector)
      // @ts-ignore
      .captureStream(30);
    if (dest.current) {
      dest.current.stream.addTrack(stream.getTracks()[0]);
      recorder.current = new MediaRecorder(dest.current.stream);
      recorder.current.ondataavailable = (e) => {
        if (e.data.size) {
          chunks.push(e.data);
        }
      };
      recorder.current.onstop = () => {
        const blob = new Blob(chunks);
        recordedBlobURL.current = URL.createObjectURL(blob);
      };
      recorder.current.start();
    } else {
      console.log("dest audio node not found");
    }
  };

  const setupNodes = () => {
    if (!gainNodeRef.current) {
      if (audioContext) {
        gainNodeRef.current = audioContext.current.createGain();
      }
    }

    if (!analyserNodeRef.current) {
      if (audioContext) {
        analyserNodeRef.current = audioContext.current.createAnalyser();
        gainNodeRef.current?.connect(analyserNodeRef.current);
        gainNodeRef.current?.connect(audioContext.current.destination);
      }
    }
  };

  useEffect(() => {
    setupNodes();
    stopPlayingAudio();
  }, [selectedMusic, audioSource]);

  const playPauseHandler = () => {
    if (isAudioPlaying) {
      stopPlayingAudio();
    } else {
      playAudio();
      setIsAudioPlaying(true);
    }
  };

  const stopPlayingAudio = () => {
    if (audioBufferSourceNode.current) {
      audioBufferSourceNode.current.stop(0);
      setIsAudioPlaying(false);
    }
  };

  const playAudio = async () => {
    let buf;
    if (audioSource === AudioSource.SelectedAudio) {
      const resp = await fetch(selectedMusic);
      buf = await resp.arrayBuffer();
    } else {
      buf = userUploadedMusic?.slice(0);
    }

    const audioBuffer: AudioBuffer = await audioContext.current.decodeAudioData(
      // @ts-ignore
      buf
    );

    if (audioContext.current && audioBuffer && gainNodeRef.current) {
      await audioContext.current.resume();
      audioBufferSourceNode.current = audioContext.current.createBufferSource();
      audioBufferSourceNode.current.connect(gainNodeRef.current);
      audioBufferSourceNode.current.buffer = audioBuffer;
      audioBufferSourceNode.current.start(0);
      audioBufferSourceNode.current.onended = () => {
        setIsAudioPlaying(false);
        if (recorder.current) {
          recorder.current.stop();
        }
      };
      dest.current = audioContext.current.createMediaStreamDestination(); // creating a audio stream that we will use for recording
      audioBufferSourceNode.current.connect(dest.current);
    } else {
      await setupNodes();
      alert("There was an error in setting up Audio Context");
      playAudio();
    }
  };

  const downloadHandler = async () => {
    if (isAudioDownloading) {
      setIsAudioDownloading(false);
      stopPlayingAudio();
    } else {
      recordedBlobURL.current = undefined;
      setIsAudioDownloading(true);
      if (!isAudioPlaying) {
        await playAudio();
      }
      record();
      const checkIfRecorded = () => {
        if (recordedBlobURL.current) {
          const link = document.createElement("a");
          // @ts-ignore
          link.className = "hiddenDownloadLink";
          link.download = name + ".webm";
          link.href = recordedBlobURL.current;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          setIsAudioDownloading(false);
        } else {
          setTimeout(checkIfRecorded, 1000);
        }
      };
      checkIfRecorded();
    }
  };

  return (
    <div style={{ width: SingleCanvasDimensions.Width }}>
      <div
        className={styles.visCanvas}
        id={name.replaceAll(" ", "") + "-sketch"}
      >
        <ReactP5Wrapper
          sketch={sketch}
          analyserNode={analyserNodeRef.current}
          gainNode={gainNodeRef.current}
          audioContext={audioContext.current}
        />
      </div>
      <div className={styles.infoContainer}>
        <div className={styles.sketchName}>{name} Visualisation</div>

        <div className={styles.canvasControls}>
          <button onClick={playPauseHandler}>
            {isAudioPlaying ? "Stop" : "Play"}
          </button>
          <button onClick={downloadHandler}>
            {isAudioDownloading ? "Stop Downloading" : "Download"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AudioVisCanvas;
