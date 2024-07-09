const fetch = require('node-fetch');

module.exports = {
  name: 'نوع',
  description: 'تحديد الجنس المحتمل بناءً على الاسم المدخل.',
  hasPermission: 0,
  usage: '[الاسم]',
  execute: async (api, event) => {
    const name = event.body.split(' ')[1];

    if (!name) {
      api.sendMessage('الرجاء إدخال اسم لتحديد الجنس.', event.threadID, event.messageID);
      return;
    }

    try {
      const response = await fetch(`https://api.genderize.io?name=${encodeURIComponent(name)}`);
      const data = await response.json();

      if (data.gender) {
        const message = `═══════════\nالاسم: ${name}\nالجنس المحتمل: ${data.gender}\nالاحتمالية: ${Math.round(data.probability * 100)}%`;
        api.sendMessage(message, event.threadID, event.messageID);
      } else {
        api.sendMessage('لا يمكن تحديد الجنس للاسم المدخل.', event.threadID, event.messageID);
      }
    } catch (error) {
      console.error(error);
      api.sendMessage('حدث خطأ أثناء جلب البيانات.', event.threadID, event.messageID);
    }
  }
};