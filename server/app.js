import { writeFile as _writeFile } from "fs";
import { join } from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { resolve as _resolve } from "path";
import OpenAI from "openai";
import cors from "cors";
import express from "express";
import "dotenv/config";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const __dirname = dirname(fileURLToPath(import.meta.url));
const speechFile = join(__dirname, "openai.mp3");

const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());

app.get("/file", async (req, res) => {
  const mp3 = await openai.audio.speech.create({
    model: "tts-1",
    voice: "alloy",
    input:
      "The TTS model generally follows the Whisper model in terms of language support. Whisper supports the following languages and performs well despite the current voices being optimized for English:Afrikaans, Arabic, Armenian, Azerbaijani, Belarusian, Bosnian, Bulgarian, Catalan, Chinese, Croatian, Czech, Danish, Dutch, English, Estonian, Finnish, French, Galician, German, Greek, Hebrew, Hindi, Hungarian, Icelandic, Indonesian, Italian, Japanese, Kannada, Kazakh, Korean, Latvian, Lithuanian, Macedonian, Malay, Marathi, Maori, Nepali, Norwegian, Persian, Polish, Portuguese, Romanian, Russian, Serbian, Slovak, Slovenian, Spanish, Swahili, Swedish, Tagalog, Tamil, Thai, Turkish, Ukrainian, Urdu, Vietnamese, and Welsh.",
  });
  const buffer = Buffer.from(await mp3.arrayBuffer());
  await fs.promises.writeFile(speechFile, buffer);

  res.sendFile(speechFile, {
    mimetype: "audio/mpeg",
    lastModified: false,
    headers: false,
  });
});

app.get("/stream", async (req, res) => {
  const response = await openai.audio.speech.create({
    model: "tts-1",
    voice: "alloy",
    input:
      "The TTS model generally follows the Whisper model in terms of language support. Whisper supports the following languages and performs well despite the current voices being optimized for English:Afrikaans, Arabic, Armenian, Azerbaijani, Belarusian, Bosnian, Bulgarian, Catalan, Chinese, Croatian, Czech, Danish, Dutch, English, Estonian, Finnish, French, Galician, German, Greek, Hebrew, Hindi, Hungarian, Icelandic, Indonesian, Italian, Japanese, Kannada, Kazakh, Korean, Latvian, Lithuanian, Macedonian, Malay, Marathi, Maori, Nepali, Norwegian, Persian, Polish, Portuguese, Romanian, Russian, Serbian, Slovak, Slovenian, Spanish, Swahili, Swedish, Tagalog, Tamil, Thai, Turkish, Ukrainian, Urdu, Vietnamese, and Welsh.",
    response_format: "opus",
  });
  let stream = response.body;
  stream.pipe(res);
  stream.on("error", (err) => {
    res.status(500).send(`error: ${err.message}`);
  });
  stream.on("end", res.end);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
