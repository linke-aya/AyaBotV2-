const axios = require('axios');

module.exports = {
  name: "بطاقة",
  type: '❍ الـوسائط ❍',
  version: "1.0.0",
  hasPermission: 0,
  description: "يسحب بطاقة عشوائية من مجموعة أوراق اللعب",
  execute: async (api, event) => {
    try {
      // إرسال طلب إلى API للحصول على بطاقة عشوائية
      const response = await axios.get('https://deckofcardsapi.com/api/deck/new/draw/?count=1');
      const card = response.data.cards[0];

      // تكوين رسالة تحتوي على معلومات البطاقة
      const message = `───────────\nلقد سحبت بطاقة عشوائية:\n───────────\n- النوع: ${card.suit}\n────────────\n- القيمة: ${card.value}`;

      // إرسال الرد للمستخدم
      api.sendMessage({
        body: message,
        attachment: await axios({
          url: card.image,
          responseType: 'stream'
        }).then(response => response.data)
      }, event.threadID, event.messageID);

    } catch (error) {
      console.error('Error fetching from Deck of Cards API:', error);
      api.sendMessage('حدث خطأ أثناء محاولة سحب بطاقة. حاول مرة أخرى لاحقاً.', event.threadID, event.messageID);
    }
  }
};