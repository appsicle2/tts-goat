const OpenAI = require("openai");
const fs = require("fs");
const path = require("path");

// gets API Key from environment variable OPENAI_API_KEY
const openai = new OpenAI();

const speechFile = path.resolve(__dirname, "./speech.mp3");

async function streamToFile(stream, path) {
  return new Promise((resolve, reject) => {
    const writeStream = fs
      .createWriteStream(path)
      .on("error", reject)
      .on("finish", resolve);

    stream.pipe(writeStream).on("error", (error) => {
      writeStream.close();
      reject(error);
    });
  });
}

async function main() {
  const mp3 = await openai.audio.speech.create({
    model: "tts-1",
    voice: "alloy",
    input: "the quick brown chicken jumped over the lazy dogs",
  });

  await streamToFile(mp3.body, speechFile);
}
main();
