const axios = require('axios');

module.exports = {
  name: 'ترجمة',
  type: '❍ الـوسائط ❍',
  hasPermission: 0,
  description: 'يقوم بتحويل النص بين اللغة العربية والإنجليزية',
  execute: async (api, event) => {
    const args = event.body.split(' ');
    let text = args.slice(1).join(' ');

    if (!text) {
      if( event.messageReply) {
       text = event.messageReply.body
       return 
      }
      return api.sendMessage('الاستخدام: ترجمة [النص]', event.threadID, event.messageID);
     
    }

    // تحديد اللغة المصدرية والهدفية
    const sourceLanguage = /^[a-zA-Z]+$/.test(text) ? 'en' : 'ar';
    const targetLanguage = sourceLanguage === 'ar' ? 'en' : 'ar';

    try {
      // طلب الترجمة من Google Translate API
      const response = await axios.post('https://translate.google.com/translate_a/single', null, {
        params: {
          client: 'gtx',
          sl: sourceLanguage,
          tl: targetLanguage,
          dt: 't',
          q: text
        }
      });

      if (response.data && Array.isArray(response.data[0])) {
        const translatedText = response.data[0][0][0];
        api.sendMessage(`${translatedText}`, event.threadID, event.messageID);
      } else {
        api.sendMessage('عذرًا، لم أتمكن من تحويل النص في الوقت الحالي.', event.threadID, event.messageID);
      }
    } catch (error) {
      console.error(error);
      api.sendMessage('عذرًا، حدث خطأ أثناء معالجة الطلب.', event.threadID, event.messageID);
    }
  }
};