import React, { useState } from "react";
import ProgressSection from "./ProgressSection";
import "./App.css";

function Streamer() {
  const [message, setMessage] = useState("");
  const [audio, setAudio] = useState(null);
  const [audio2, setAudio2] = useState(null);
  const [isPaused, setIsPaused] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const pageStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };

  const buttonControlsStyle = {
    margin: "12px",
    padding: "12px",
  };

  const textAreaStyle = {
    margin: "12px",
    padding: "12px",
    fontSize: "16px",
    border: "none",
    outline: "none",
    width: "700px",
    height: "500px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    lineHeight: "normal",
    resize: "none",
  };

  const submit = (text) => {
    setAudio(null); // reset Audio
    setIsLoading(true);

    fetch('http://localhost:3000/stream')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const stream = response.body;
        const buffers = [];

        // Process the stream
        const processStream = ({ done, value }) => {
          if (done) {
            setIsLoading((previousState) => { return false; });
            console.log('done processing blobs');
            return;
          }

          const arrayBuffer = value.buffer.slice(0);
          console.log('buffer being processed: ', arrayBuffer);
          buffers.push(arrayBuffer);

          // Create a blob from the arrayBuffer
          const blob = new Blob(buffers, { type: 'audio/mp3' });

          // Create a blob URL
          const blobUrl = URL.createObjectURL(blob);

          // Create an Audio object with the blob URL
          const incomingAudio = new Audio(blobUrl);

          if (buffers.length === 1) {
            console.log('setting audio1 ', blobUrl);
            setAudio((_prevState) => { return incomingAudio });
          } else {
            console.log('setting audio 2 ', blobUrl);
            setAudio2((_prevState) => { return incomingAudio; });
          }

          reader.read().then(processStream);
        };

        const reader = stream.getReader();
        reader.read().then(processStream);
      })
  };

  const togglePlayPauseButton = () => {
    if (audio.paused) {
      audio.play();
      setIsPaused(false);
      audio.addEventListener("ended", audioEnded);
    } else {
      audio.pause();
      setIsPaused(true);
    }
  };

  const audioEnded = () => {
    while (isLoading || audio.src !== audio2.src) {
      if (audio.src !== audio2.src) {
        console.log(audio.duration);
        console.log(audio.currentTime);
        console.log(audio.src);

        const currentTime = audio.currentTime;
        const newSrc = audio2.src;
        audio.src = newSrc;
        audio.load();
        audio.currentTime = currentTime;

        console.log(audio.src);
        console.log(audio.duration);
        console.log(audio.currentTime);
        togglePlayPauseButton();
        return;
      }
    }
    console.log('real end');
    console.log(audio.src);
    console.log(audio2.src);
    setIsPaused(true);
  };

  return (
    <div style={pageStyle}>
      <div style={buttonControlsStyle}>
        <button type="submit" onClick={() => submit(message)}>
          Search
        </button>
        {audio ? (
          <button id="playPauseButton" onClick={togglePlayPauseButton}>
            {isPaused ? "Play" : "Pause"}
          </button>
        ) : null}
      </div>
      <ProgressSection audio={audio} />
      <textarea
        type="text"
        name="queryMessage"
        onChange={(e) => setMessage(e.target.value)}
        style={textAreaStyle}
      />
    </div>
  );
}

export default Streamer;
