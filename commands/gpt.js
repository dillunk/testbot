import OpenAI from "openai";
const openAi = new OpenAI({
  apiKey: process.env.OPEN_AI_APIKEY,
});

import dotenv from "dotenv";
dotenv.config();

let prompts = [];

export async function OpenAiChatGPT(msg) {
  try {
    const prompt = msg.body.split(" ").slice(1).join(" ");
    const clientId = msg.from;

    msg.reply("🤖: Tunggu bentar...");

    function CreateMessageIdentity(from, role, message) {
      return {
        sender: from,
        message: { role: role, content: message },
      };
    }

    if (msg.hasQuotedMsg) {
      const quotedMessage = await msg.getQuotedMessage();
      prompts.push(
        CreateMessageIdentity("gpt", "assistant", quotedMessage.body)
      );
    }
    prompts.push(CreateMessageIdentity(clientId, "user", prompt));

    const replyMessage = await openAi.chat.completions.create({
      messages: prompts.map((data) => data.message),
      model: "gpt-3.5-turbo",
    });

    console.log(prompts);

    prompts = [];

    const replyMessageContent = replyMessage.choices[0].message.content;
    msg.reply(replyMessageContent);
  } catch (err) {
    console.error(err);
  }
}
