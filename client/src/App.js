import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const [audio, setAudio] = useState(null);

  const submit = async (text) => {
    const response = await axios.get('http://localhost:3000/', { responseType: 'blob' });
    const blobUrl = URL.createObjectURL(new Blob([response.data]));
    const audioResponse = new Audio(blobUrl);
    setAudio(audioResponse);
  };

  return (
    <div>
      {message}
      <div>
        <input name="query" onChange={(e) => setMessage(e.target.value)} />
        <button type="submit" onClick={() => submit(message)}>
          Search
        </button>
        <button type="submit" onClick={() => {audio.play()}}>
          Play Audio
        </button>
      </div>
    </div>
  );
}

export default App;
