import pkg from "whatsapp-web.js";
const { Client, LocalAuth, MessageMedia } = pkg;

import { YouTube, YtMp3 } from "./commands/youtube.js";
import { OpenAiChatGPT } from "./commands/gpt.js";

const clientOptions = {
  puppeteer: {
    headless: false,
  },
  authStrategy: new LocalAuth(),
};
const client = new Client(clientOptions);

function main() {
  client.on("qr", (qr) => {
    console.log("QR RECEIVED", qr);
  });

  client.on("message_create", (msg) => {
    if (msg.body.startsWith("!ping")) {
      msg.reply("Hello Bro!");
    }
    if (msg.body.startsWith("!dl")) {
      YtMp3(msg);
    }
    if (msg.body.startsWith("!yt")) {
      YouTube(msg);
    }
    if (msg.body.startsWith("!gpt")) {
      OpenAiChatGPT(msg);
    }
  });

  client.on("ready", () => {
    console.log("Client is ready!");
  });

  client.initialize();
}

main();
