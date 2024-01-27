import React, { useState } from "react";
import ProgressSection from './ProgressSection';
import axios from "axios";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const [audio, setAudio] = useState(null);
  const [isPaused, setIsPaused] = useState(true);

  const pageStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  }

  const buttonControlsStyle = {
    margin: '12px',
    padding: '12px',
  }

  const textAreaStyle = {
    margin: '12px',
    padding: '12px',
    fontSize: '16px',
    border: 'none',
    outline: 'none',
    width: '700px',
    height: '500px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    lineHeight: 'normal',
    resize: 'none',
  };

  const submit = async (text) => {
    const response = await axios.get('http://localhost:3000/', { responseType: 'blob' });
    const blobUrl = URL.createObjectURL(new Blob([response.data]));
    const audioResponse = new Audio(blobUrl);
    setAudio(audioResponse);
  };

  const togglePlayPauseButton = () => {
    if (audio === null) {
      return;
    }
    if (audio.paused) {
      audio.play();
      setIsPaused(false);
      audio.addEventListener('ended', audioEnded);
    } else {
      audio.pause();
      setIsPaused(true);
    }
  }

  const audioEnded = () => {
    setIsPaused(true);
  }

  return (
    <div style={pageStyle}>
      <div style={buttonControlsStyle}>
        <button type="submit" onClick={() => submit(message)}>
          Search
        </button>
        <button id="playPauseButton" onClick={togglePlayPauseButton}>{isPaused ? 'Play' : 'Pause'}</button>
      </div>
      <ProgressSection audio={audio} />
      <textarea type="text" name="queryMessage" onChange={(e) => setMessage(e.target.value)} style={textAreaStyle} />
    </div>
  );
}

export default App;



