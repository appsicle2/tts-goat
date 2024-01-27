import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");

  const submit = (text) => {
    axios
      .post("http://localhost:3000/voice", { text })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <div>
      {message}
      <div>
        <input name="query" onChange={(e) => setMessage(e.target.value)} />
        <button type="submit" onClick={() => submit(message)}>
          Search
        </button>
      </div>
    </div>
  );
}

export default App;
