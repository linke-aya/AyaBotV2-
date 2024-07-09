const axios = require('axios');

module.exports = {
  name: 'عملة',
  otherName: ['crypto', 'coin'],
  version: '1.0.0',
  description: 'يعرض لك معلومات عن العملة الرقمية المدخلة',
  usage: 'عملة > اسم العملة',
  execute: async (api, event) => {
    const args = event.body.split(' ').slice(1);
    if (args.length === 0) {
      api.sendMessage('يرجى توفير اسم العملة الرقمية', event.threadID, event.messageID);
      return;
    }
    
    const coinName = args[0].toLowerCase();

    try {
      const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${coinName}`);
      const data = response.data;

      const messageText = `
─────────────────
اسم العملة: ${data.name}
─────────────────
الرمز: ${data.symbol.toUpperCase()}
─────────────────
السعر الحالي: $${data.market_data.current_price.usd}
─────────────────
التغيير خلال 24 ساعة: ${data.market_data.price_change_percentage_24h}%
─────────────────
رابط العملة: ${data.links.homepage[0]}
─────────────────
`;

      api.sendMessage(messageText, event.threadID, event.messageID);
    } catch (error) {
      console.error('Error fetching coin data:', error);
      api.sendMessage('حدث خطأ أثناء محاولة جلب بيانات العملة. تأكد من صحة اسم العملة وحاول مرة أخرى.', event.threadID, event.messageID);
    }
  }
};