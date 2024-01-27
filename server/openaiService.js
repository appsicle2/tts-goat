import fs from "fs";
import OpenAI from "openai";
import { resolve as _resolve } from "path";
import "dotenv/config";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const streamToFile = async (stream, path) =>
  new Promise((resolve, reject) => {
    const writeStream = fs.createWriteStream(path)
      .on("error", reject)
      .on("finish", resolve);

    stream.pipe(writeStream).on("error", (error) => {
      writeStream.close();
      reject(error);
    });
  });

const getAudio = async (speechFile) => {
  const mp3 = await openai.audio.speech.create({
    model: "tts-1",
    voice: "alloy",
    input: "the quick brown",
  });
  return mp3.body;
  // await streamToFile(mp3.body, speechFile);
};

export default getAudio;