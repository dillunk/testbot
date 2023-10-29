import dotenv from "dotenv";
dotenv.config();

import pkg from "whatsapp-web.js";
const { MessageMedia } = pkg;

import ytmp3 from "yt-converter";

export async function YouTube(msg) {
  try {
    const prompt = msg.body.split(" ").slice(1).join(" ");

    const ytBaseUrl = "https://www.googleapis.com/youtube/v3/search";
    const ytURL = new URL(ytBaseUrl);

    const part = "snippet";
    const maxResult = 10;
    const q = prompt;
    const type = "video";

    const key = process.env.YT_API_KEY;

    ytURL.searchParams.append("part", part);
    ytURL.searchParams.append("maxResults", maxResult);
    ytURL.searchParams.append("q", q);
    ytURL.searchParams.append("type", type);
    ytURL.searchParams.append("key", key);

    const stringUrl = ytURL.toString();
    const youtubeResponse = await fetch(stringUrl);
    const jsonYtResponses = await youtubeResponse.json();

    let replyMessage = "";
    let i = 1;

    for (const data of jsonYtResponses.items) {
      const title = data.snippet.title;
      const videoId = data.id.videoId;

      const baseWatchVideoUrl = "https://www.youtube.com/watch";

      const videoUrl = new URL(baseWatchVideoUrl);
      videoUrl.searchParams.append("v", videoId);

      const videoUrlString = videoUrl.toString();

      const text = `${i} Judul: ${title}, URL: ${videoUrlString}\n`;
      replyMessage += text;

      i++;
    }

    msg.reply(replyMessage);
  } catch (err) {
    console.log(err);
  }
}

// export async function YtMp3(msg) {
//   try {
//     const prompt = msg.body.split(" ").slice(1).join(" ");

//     async function onfinished() {
//       ytmp3.getInfo(prompt).then((info) => {
//         try {
//           const audioPath = `./tempAudio/${info.title}.mp3`;
//           const messageMedia = MessageMedia.fromFilePath(audioPath);

//           msg.reply(messageMedia);
//         } catch (err) {
//           console.log(err);
//         }
//       });
//     }

//     ytmp3.convertAudio(
//       {
//         url: prompt,
//         directoryDownload: "./tempAudio/",
//         itag: 140,
//         title: `yoww`,
//       },
//       undefined,
//       onfinished
//     );
//   } catch (err) {
//     console.log(err);
//   }
// }
export async function YtMp3(msg) {
  try {
    const quotedMessage = await msg.getQuotedMessage();

    const promptNumber = parseInt(msg.body.split(" ").slice(1).join(" "));

    console.log(quotedMessage);
    const selectedMessage = await quotedMessage.body.split("\n")[
      promptNumber ? promptNumber + 1 : 1
    ];

    console.log(selectedMessage);
    const videoId = selectedMessage
      .split("https://www.youtube.com/watch?v=")
      .pop();

    const baseWatchVideoUrl = "https://www.youtube.com/watch";

    const videoUrl = new URL(baseWatchVideoUrl);
    videoUrl.searchParams.append("v", videoId);

    async function onfinished() {
      try {
        const info = await ytmp3.getInfo(videoUrl);
        const audioPath = `./tempAudio/${info.title}.mp3`;
        const messageMedia = MessageMedia.fromFilePath(audioPath);

        msg.reply(messageMedia);
      } catch (err) {
        console.log(err);
      }
    }

    await ytmp3.convertAudio(
      {
        url: videoUrl,
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
