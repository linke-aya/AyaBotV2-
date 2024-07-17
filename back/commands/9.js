
const axios = require('axios');
require('dotenv').config();

const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY;

module.exports = {
  name: 'بوت',
  type: 'gpt',
  info: "للإجابة على الأسئلة",
  version: "1.
module.exports = {
  name: 'بوت',
  type: 'gpt',
  info: "للإجابة على الأسئلة",
  version: "1.0.1",
  usageCount: 0,
  run: async (api, event) => {
    const prompt = event.body.slice(event.body.indexOf(' ') + 1).trim();
    
    if (!prompt) {
      return api.sendMessage('يرجى توفير سؤال', event.threadID, event.messageID);
    }

    try {
      const response = await axios.post(
        'https://api-inference.huggingface.co/models/akhooli/gpt2-small-arabic',
        { inputs: prompt },
        {
          headers: {
            'Authorization': `Bearer ${HUGGING_FACE_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data && response.data.length > 0 && response.data[0].generated_text) {
        let reply = response.data[0].generated_text;

        // التحقق من طول النص وتقسيمه إذا كان طويلاً
        const maxMessageLength = 2000; // الحد الأقصى لعدد الأحرف في رسالة فيسبوك
        if (reply.length > maxMessageLength) {
          let messages = [];
          for (let i = 0; i < reply.length; i += maxMessageLength) {
            messages.push(reply.substring(i, i + maxMessageLength));
          }
          
          for (const message of messages) {
            await api.sendMessage(message, event.threadID, event.messageID);
          }
        } else {
          api.sendMessage(reply, event.threadID, event.messageID);
        }
      } else {
        throw new Error('Empty response or unexpected response structure');
      }
    } catch (error) {
      console.error('Error fetching generated text:', error);
      api.sendMessage('حدث خطأ أثناء محاولة الحصول على إجابة.', event.threadID, event.messageID);
    }
  }
};