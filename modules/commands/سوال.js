const axios = require('axios');

module.exports = {
  name: "سؤال",
  type: '❍ الـوسائط ❍',
  version: "1.0.0",
  hasPermission: 0,
  description: "يجيب على أسئلتك بنعم أو لا",
  execute: async (api, event) => {
    try {
      // إرسال طلب إلى API
      const response = await axios.get('https://yesno.wtf/api');
      
      // استخراج الرد
      const answer = response.data.answer; // إجابة بنعم أو لا
      const imageUrl = response.data.image; // صورة الإجابة

      // إرسال الرد للمستخدم
      api.sendMessage({
        body: `إجابة سؤالك هي: ${answer.toUpperCase()}`,
        attachment: await axios.get(imageUrl, { responseType: 'stream' }).then(res => res.data)
      }, event.threadID, event.messageID);

    } catch (error) {
      console.error('Error fetching from YesNo API:', error);
      api.sendMessage('حدث خطأ أثناء محاولة الحصول على الإجابة. حاول مرة أخرى لاحقاً.', event.threadID, event.messageID);
    }
  }
};