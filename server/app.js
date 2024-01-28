import { TextToSpeechClient } from "@google-cloud/text-to-speech";
import express, { json } from "express";
import { writeFile as _writeFile, createReadStream } from "fs";
import util from "util";
import cors from "cors";
import { join } from "path";
import { getAudio, getAudioFile } from "./openaiService.js";
import { dirname } from "path";
import { fileURLToPath } from "url";
import byline from "byline";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  const speechFile = join(__dirname, "openai.mp3");
  await getAudioFile(speechFile);

  res.sendFile(speechFile, {
    mimetype: "audio/mpeg",
    lastModified: false,
    headers: false,
  });
});

app.get('/stream', async (req, res) => {
  const speechFile = join(__dirname, "openai.mp3");
  // write to file as stream
  await getAudio(speechFile);

  // read from file as stream
  let stream = createReadStream(speechFile);
  stream.pipe(res);
  stream.on('end', res.end);
});


app.get("/openai", async (req, res) => {
  const mp3Path = join(__dirname, "openai.mp3");
  const body = await getAudio(mp3Path);
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
