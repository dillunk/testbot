import dotenv from "dotenv";
dotenv.config();

import pkg from "whatsapp-web.js";
const { MessageMedia } = pkg;

import ytmp3 from "yt-converter";

export function YouTube(msg) {
  const prompt = msg.body.split(" ").slice(1).join(" ");

  const ytUrl = new URL("https://www.googleapis.com/youtube/v3/search");

  const part = "snippet";
  const maxResult = 10;
  const q = prompt;
  const type = "video";
  const key = process.env.YT_API_KEY;

  ytUrl.searchParams.append("part", part);
  ytUrl.searchParams.append("maxResults", maxResult);
  ytUrl.searchParams.append("q", q);
  ytUrl.searchParams.append("type", type);
  ytUrl.searchParams.append("key", key);

  fetch(ytUrl.toString())
    .then((resp) => resp.json())
    .then((datas) => {
      let replyMessage = "";

      for (const data of datas.items) {
        const title = data.snippet.title;
        const videoId = data.id.videoId;

        const videoUrl = new URL("https://www.youtube.com/watch");
        videoUrl.searchParams.append("v", videoId);

        const videoUrlString = videoUrl.toString();

        const text = `=> Judul: ${title}, URL: ${videoUrlString}\n`;
        replyMessage += text;
      }

      msg.reply(replyMessage);
    });
}

export async function YtMp3(msg) {
  try {
    const prompt = msg.body.split(" ").slice(1).join(" ");

    async function onfinished() {
      ytmp3.getInfo(prompt).then((info) => {
        try {
          const audioPath = `./tempAudio/${info.title}.mp3`;

          console.log(audioPath);

          const messageMedia = MessageMedia.fromFilePath(audioPath);

          console.log(messageMedia);
          msg.reply(messageMedia);
        } catch (err) {
          console.log(err);
        }
      });
    }

    ytmp3.convertAudio(
      {
        url: prompt,
        directoryDownload: "./tempAudio/",
        itag: 140,
        title: `yoww`,
      },
      undefined,
      onfinished
    );
  } catch (err) {
    console.log(err);
  }
}
