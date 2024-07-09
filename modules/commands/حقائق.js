const axios = require('axios');

module.exports = {
  name: 'حقيقة',
  description: 'استخدم Random Useless Facts API لجلب حقيقة عشوائية',
  execute: async (api, event) => {
    try {
      const response = await axios.get('https://uselessfacts.jsph.pl/random.json?language=ar');
      const fact = response.data.text;

      const message = `══════════\n${fact}\n──────────`;

      api.sendMessage(message, event.threadID, event.messageID);
    } catch (error) {
      console.error('Error fetching random fact:', error);
      api.sendMessage('حدث خطأ أثناء محاولة جلب حقيقة عشوائية. حاول مرة أخرى لاحقاً.', event.threadID, event.messageID);
    }
  }
};
