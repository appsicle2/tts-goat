import { TextToSpeechClient } from "@google-cloud/text-to-speech";
import express from "express";
import { json } from "express";
import { writeFile as _writeFile } from "fs";
import { promisify } from "util";
import cors from "cors";
import { join } from "path";
import openAIService from "./openaiService.js";
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

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
  const mp3Path = join(__dirname, "output.mp3");
  res.sendFile(mp3Path, {
    mimetype: "audio/mpeg",
    lastModified: false,
    headers: false,
  });
});

app.get("/openai", async (req, res) => {
  const mp3Path = join(__dirname, "openai.mp3");
  const body = await openAIService.getAudio(mp3Path);
  console.log(body);
  res.send(body);
  // res.sendFile(mp3Path, {
  //   mimetype: "audio/mpeg",
  //   lastModified: false,
  //   headers: false,
  // });
});

app.post("/voice", (req, res) => {
  const { text } = req.body;
  console.log(text);
  res.send(text);
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
