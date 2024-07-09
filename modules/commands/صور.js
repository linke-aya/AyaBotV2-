const axios = require('axios');

module.exports = {
  name: 'استجابة',
  type: '❍ غير مستقر ❍',
  description: "توليد استجابة بناءً على طلب معين باستخدام GPT-4",
  execute: async (api, event) => {
    const prompt = event.body.slice(event.body.indexOf(' ') + 1); // استخراج الطلب من الرسالة

    if (!prompt) {
      return api.sendMessage('يرجى توفير طلب لتوليد استجابة.', event.threadID, event.messageID);
    }

    try {
      const response = await axios.get(`https://gpt4withcustommodel.onrender.com/imagine?prompt=${encodeURIComponent(prompt)}`);
      const reply = response.data.reply;

      api.sendMessage(`${reply}`, event.threadID, event.messageID);
    } catch (error) {
      console.error('Error fetching generated response:', error);
      api.sendMessage('حدث خطأ ', event.threadID, event.messageID);
    }
  }
};