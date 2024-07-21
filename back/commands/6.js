const axios = require('axios');
const fs = require('fs-extra');


module.exports = {
  name: "تخيل",
  otherName: ['تخيلي', 'ارسم', 'ارسمي'],
  type: 'الصور',
  updatedAt: '2024/7/20',
  version: "1.0.1",
  creator: 'لنك',
  usageCount: 0,
  info: "انشاء صور بالذكاء الاصطناعي",
  run: async (api, event) => {
    const args = event.body.split(' ').slice(1);
    let { threadID, messageID } = event;
    let query = args.join(" ");
    if (!query) return api.sendMessage('⚠️ | اكتب نصاً', threadID, messageID);
    let path = __dirname + `/cache/ai.png`;

    const translationResponse = await axios.get(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(query)}`);
    const translation = translationResponse.data[0][0][0];

    const poli = (await axios.get(`https://image.pollinations.ai/prompt/${translation}`, {
      responseType: "arraybuffer",
    })).data;
    fs.writeFileSync(path, Buffer.from(poli, "utf-8"));
 
    api.sendMessage({
      body: "──────────\nطلبك\n──────────",
      attachment: fs.createReadStream(path)
    }, threadID, () => fs.unlinkSync(path), messageID);
  }


};


