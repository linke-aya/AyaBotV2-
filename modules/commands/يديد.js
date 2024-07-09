const axios = require('axios');
const fs = require('fs-extra');

module.exports = {
  name: "دمج",
  type: '❍ الـوسائط ❍',
  version: "1.2",
  hasPermssion: 0,
  description: "مالي خلق اكتب شرح",
  execute: async (api, event) => {
    const args = event.body.split(' ').slice(1);
    const readStream = [];
    const emoji1 = args[0];
    const emoji2 = args[1];

    if (!emoji1 || !emoji2)
      return api.sendMessage("استخدام خاطئ", event.threadID);

    const generate1 = await generateEmojimix(emoji1, emoji2);
    const generate2 = await generateEmojimix(emoji2, emoji1);

    if (generate1)
      readStream.push(generate1);
    if (generate2)
      readStream.push(generate2);

    if (readStream.length == 0)
      return api.sendMessage(`مش ممكن دمج  ${emoji1} مع هذا ${emoji2}`, event.threadID);

    api.sendMessage({
      body: `تم دمجت  ${emoji1} مع دا ${emoji2}`,
      attachment: readStream
    }, event.threadID);
  }
};

async function generateEmojimix(emoji1, emoji2) {
  try {
    const { data: response } = await axios.get("https://goatbotserver.onrender.com/taoanhdep/emojimix", {
      params: {
        emoji1,
        emoji2
      },
      responseType: "stream"
    });
    response.path = `emojimix${Date.now()}.png`;
    return response;
  } catch (e) {
    return null;
  }
}