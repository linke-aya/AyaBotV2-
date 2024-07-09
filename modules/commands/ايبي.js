const axios = require('axios');

module.exports = {
  name: 'ip',
  type: '❍ الـوسائط ❍',
  description: "احصل على عنوان IP العام الخاص بك باستخدام خدمة ipify",
  execute: async (api, event) => {
    try {
      const response = await axios.get('https://api.ipify.org?format=json');
      const ip = response.data.ip;
      api.sendMessage(`────────────\nعنوان IP العام الخاص بك هو \n────────────\n ${ip}`, event.threadID, event.messageID);
    } catch (error) {
      console.error('Error fetching IP address:', error);
      api.sendMessage('حدث خطأ أثناء محاولة الحصول على عنوان IP الخاص بك. حاول مرة أخرى لاحقاً.', event.threadID, event.messageID);
    }
  }
};