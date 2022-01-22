import React, { useEffect, useRef, useState } from "react";
import { ReactP5Wrapper } from "react-p5-wrapper";
import {
  AudioSource,
  useGlobalStateContext,
} from "../../data/GlobalStateProvider";
import styles from "./AudioVisCanvas.module.scss";
import sketch from "./sketches/WaveformSketch";
import { SingleCanvasDimensions } from "../../data/constants";

let audioContext = new AudioContext();
let audioBufferSourceNode: AudioBufferSourceNode;
let recorder: MediaRecorder;
let recordedBlobURL: string;
let dest: any;
let chunks: any = [];

const record = () => {
  chunks.length = 0;
  // @ts-ignore
  let stream = document
    .querySelector("#waveform-sketch canvas")
    // @ts-ignore
    .captureStream(30);
  dest.stream.addTrack(stream.getTracks()[0]);

  recorder = new MediaRecorder(dest.stream);
  recorder.ondataavailable = (e) => {
    if (e.data.size) {
      chunks.push(e.data);
    }
  };
  recorder.onstop = () => {
    const blob = new Blob(chunks);
    recordedBlobURL = URL.createObjectURL(blob);
  };
  recorder.start();
};

const AudioVisCanvas = () => {
  const { selectedMusic, audioSource, userUploadedMusic } =
    useGlobalStateContext();
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isAudioDownloading, setIsAudioDownloading] = useState(false);
  const gainNodeRef = useRef<GainNode | null>(null);
  const analyserNodeRef = useRef<AnalyserNode | null>(null);
  const analyserDataRef = useRef<Float32Array>(new Float32Array());

  const setupNodes = () => {
    if (!gainNodeRef.current) {
      if (audioContext) {
        gainNodeRef.current = audioContext.createGain();
      }
    }

    if (!analyserNodeRef.current) {
      if (audioContext) {
        analyserNodeRef.current = audioContext.createAnalyser();
        analyserDataRef.current = new Float32Array(
          analyserNodeRef.current.fftSize
        );
        gainNodeRef.current?.connect(analyserNodeRef.current);
        gainNodeRef.current?.connect(audioContext.destination);
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
    if (audioBufferSourceNode) {
      audioBufferSourceNode.stop(0);
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

    // @ts-ignore
    const audioBuffer: AudioBuffer = await audioContext.decodeAudioData(buf);

    if (audioContext && audioBuffer && gainNodeRef.current) {
      await audioContext.resume();
      audioBufferSourceNode = audioContext.createBufferSource();
      audioBufferSourceNode.connect(gainNodeRef.current);
      audioBufferSourceNode.buffer = audioBuffer;
      audioBufferSourceNode.start(0);
      audioBufferSourceNode.onended = () => {
        setIsAudioPlaying(false);
        if (recorder) {
          recorder.stop();
        }
      };
      dest = audioContext.createMediaStreamDestination();
      audioBufferSourceNode.connect(dest);
      if (analyserNodeRef.current) {
        analyserNodeRef.current.getFloatTimeDomainData(analyserDataRef.current);
      }
    } else {
      await setupNodes();
      alert("There was an error in setting up Audio Context");
      playAudio();
    }
  };

  const downloadHandler = async () => {
    setIsAudioDownloading(true);
    await playAudio();
    record();
    const checkIfRecorded = () => {
      if (recordedBlobURL) {
        const link = document.createElement("a");
        // @ts-ignore
        link.className = "hiddenDownloadLink";
        link.download = "waveform.webm";
        link.href = recordedBlobURL;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setIsAudioDownloading(false);
      } else {
        setTimeout(checkIfRecorded, 1000);
      }
    };
    checkIfRecorded();
  };

  return (
    <div style={{ width: SingleCanvasDimensions.Width }}>
      <div className={styles.visCanvas} id="waveform-sketch">
        <ReactP5Wrapper
          sketch={sketch}
          analyserNode={analyserNodeRef.current}
        />
      </div>
      <div className={styles.infoContainer}>
        <div className={styles.sketchName}>Waveform</div>

        <div className={styles.canvasControls}>
          <button onClick={playPauseHandler}>
            {isAudioPlaying ? "Stop" : "Play"}
          </button>
          <button
            disabled={isAudioDownloading}
            onClick={downloadHandler}
            style={{ cursor: isAudioDownloading ? "not-allowed" : "pointer" }}
          >
            {isAudioDownloading ? "Downloading..." : "Download"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AudioVisCanvas;
