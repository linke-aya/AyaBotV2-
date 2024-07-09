const axios = require('axios');

module.exports = {
  name: 'مزحة',
  description: 'استخدم icanhazdadjoke API لجلب مزحة عشوائية',
  execute: async (api, event) => {
    try {
      const response = await axios.get('https://icanhazdadjoke.com/', {
        headers: { Accept: 'application/json' }
      });
      const joke = response.data.joke;

      const message = `${joke}`;

      api.sendMessage(message, event.threadID, event.messageID);
    } catch (error) {
      console.error('Error fetching random joke:', error);
      api.sendMessage('حدث خطأ أثناء محاولة جلب مزحة عشوائية. حاول مرة أخرى لاحقاً.', event.threadID, event.messageID);
    }
  }
};