const axios = require('axios');

module.exports = {
  name: 'معلومة',
  description: 'استخدم Health Facts API لجلب معلومة طبية عشوائية',
  execute: async (api, event) => {
    try {
      const response = await axios.get('https://healthfacts.io/api/random');
      const fact = response.data.fact;

      const message = `──────────\n${fact}\n══════════`;

      api.sendMessage(message, event.threadID, event.messageID);
    } catch (error) {
      console.error('Error fetching random health fact:', error);
      api.sendMessage('حدث خطأ أثناء محاولة جلب معلومة . حاول مرة أخرى لاحقاً.', event.threadID, event.messageID);
    }
  }
};