import { writeFile as _writeFile } from "fs";
import { join } from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { resolve as _resolve } from "path";
import OpenAI from "openai";
import cors from "cors";
import express from "express";
import fs from "fs";
import "dotenv/config";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const DEBUG = process.env.DEBUG;

const __dirname = dirname(fileURLToPath(import.meta.url));
const speechFile = DEBUG ? join(__dirname, "openai.mp3") : "/tmp/openai.mp3";
const SKIP_GENERATION = DEBUG;

const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

app.post("/file", async (req, res) => {
  if (!SKIP_GENERATION) {
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "alloy",
      input: req.body.text
    });
    const buffer = Buffer.from(await mp3.arrayBuffer());
    await fs.promises.writeFile(speechFile, buffer);
  }

  res.sendFile(speechFile, {
    mimetype: "audio/mpeg",
    lastModified: false,
    headers: false,
  });
});

// INACTIVE, IN DEVELOPMENT
app.get("/stream", async (req, res) => {
  try {
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Disposition', 'attachment; filename=generated_audio.mp3');

    const response = await openai.audio.speech.create({
      model: "tts-1",
      voice: "alloy",
      input:
        "The TTS model generally follows the Whisper model in terms of language support. Whisper supports the following languages and performs well despite the current voices being optimized for English:Afrikaans, Arabic, Armenian, Azerbaijani, Belarusian, Bosnian, Bulgarian, Catalan, Chinese, Croatian, Czech, Danish, Dutch, English, Estonian, Finnish, French, Galician, German, Greek, Hebrew, Hindi, Hungarian, Icelandic, Indonesian, Italian, Japanese, Kannada, Kazakh, Korean, Latvian, Lithuanian, Macedonian, Malay, Marathi, Maori, Nepali, Norwegian, Persian, Polish, Portuguese, Romanian, Russian, Serbian, Slovak, Slovenian, Spanish, Swahili, Swedish, Tagalog, Tamil, Thai, Turkish, Ukrainian, Urdu, Vietnamese, and Welsh.",
      response_format: "mp3",
    });
    let stream = response.body;
    stream.pipe(res);
    stream.on("error", (err) => {
      res.status(500).send(`error: ${err.message}`);
    });
    stream.on("end", () => {
      res.end();
    })
  } catch (error) {
    // Handle OpenAI API request error
    res.status(500).send(`Error generating TTS audio: ${error.message}`);
  }
});

app.get("/", (req, res) => {
  res.send('hello world');
})

// currently deployed on cyclic.sh
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
