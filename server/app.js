const textToSpeech = require("@google-cloud/text-to-speech");
const express = require("express");
const fs = require("fs");
const util = require("util");
const client = new textToSpeech.TextToSpeechClient();


const cors = require("cors");
const path = require('path');

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

const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  const mp3Path = path.join(__dirname, 'output.mp3');
  res.sendFile(mp3Path, { mimetype: 'audio/mpeg', lastModified: false, headers: false });
});

app.post("/voice", (req, res) => {
  const { text } = req.body;
  console.log(text);
  res.send(text);
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
