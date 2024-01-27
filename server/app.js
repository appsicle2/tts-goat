const textToSpeech = require("@google-cloud/text-to-speech");
const express = require("express");
const fs = require("fs");
const util = require("util");
const client = new textToSpeech.TextToSpeechClient();
require('dotenv').config()

const openai_key = process.env.OPEN_AI_KEY;

const cors = require("cors");

async function generateMP3(text) {
  const request = {
    input: { text },
    voice: { languageCode: "en-US", ssmlGender: "NEUTRAL" },
    audioConfig: { audioEncoding: "MP3" },
  };

  const [response] = await client.synthesizeSpeech(request);
  const writeFile = util.promisify(fs.writeFile);
  await writeFile("output.mp3", response.audioContent, "binary");
}

// const text = "My 7 year old";
// quickStart(text);

const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/voice", (req, res) => {
  const { text } = req.body;
  console.log(text);
  res.send(text);
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
