const axios = require('axios');
const HUGGING_FACE_API_KEY = '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';

module.exports = {
  name: 'جاوب',
  type: '❍ النصوص ❍',
  description: 'إجابة الأسئلة بناءً على سياق معين باستخدام نموذج من Hugging Face',
  execute: async (api, event) => {
    const args = event.body.slice(event.body.indexOf(' ') + 1).split('|');
    const context = args[0];
    const question = args[1];

    if (!context || !question) {
      return api.sendMessage('يرجى توفير سياق وسؤال للفهم.', event.threadID, event.messageID);
    }

    try {
      const response = await axios.post(
        'https://api-inference.huggingface.co/models/deepset/roberta-base-squad2',
        { inputs: { question, context } },
        {
          headers: {
            'Authorization': `Bearer ${HUGGING_FACE_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data && response.data.answer) {
        const answer = response.data.answer;
        api.sendMessage(`الإجابة: ${answer}`, event.threadID, event.messageID);
      } else {
        throw new Error('Empty response or unexpected response structure');
      }
    } catch (error) {
      console.error('Error fetching answer:', error);
      api.sendMessage('حدث خطأ أثناء محاولة الحصول على إجابة.', event.threadID, event.messageID);
    }
  }
};