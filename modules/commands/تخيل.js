const axios = require('axios');
const fs = require('fs-extra');


module.exports = {
  name: "تخيل",
  otherName: ['تخيلي', 'ارسم', 'ارسمي'],
  type: '❍ الـوسائط ❍',
  version: "1.0.1",
  hasPermssion: 0,
  description: "مدري",
  execute: async (api, event) => {
    const args = event.body.split(' ').slice(1);
    let { threadID, messageID } = event;
    let query = args.join(" ");
    if (!query) return api.sendMessage('──────────\nاين النص 🗿\n──────────', threadID, messageID);
    let path = __dirname + `/cache/pol4i.png`;

    const translationResponse = await axios.get(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(query)}`);
    const translation = translationResponse.data[0][0][0];

    const poli = (await axios.get(`https://image.pollinations.ai/prompt/${translation}`, {
      responseType: "arraybuffer",
    })).data;
    fs.writeFileSync(path, Buffer.from(poli, "utf-8"));
    setReachion(api, `:art:`, event.messageID)
    api.sendMessage({
      body: "──────────\n     طلبك\n──────────",
      attachment: fs.createReadStream(path)
    }, threadID, () => fs.unlinkSync(path), messageID);
  }


};


async function setReachion(api, reachion, messageID) {
  api.setMessageReaction(reachion, messageID, (err) => {
    if (err) console.error('Filed Set Reachion ', err)
  })
}