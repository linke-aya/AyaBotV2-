const axios = require('axios');
const { format } = require('date-fns');

module.exports = {
  name: 'تاريخ',
  otherName: ['date'],
  version: '1.0.0',
  description: 'يعرض لك معلومات تاريخية حسب التاريخ المدخل',
  usage: 'تاريخ > YYYYMMDD',
  execute: async (api, event) => {
    const args = event.body.split(' ').slice(1);
    if (args.length === 0) {
      api.sendMessage('يرجى توفير تاريخ بصيغة YYYYMMDD', event.threadID, event.messageID);
      return;
    }
    const date = args[0];
    const formattedDate = format(new Date(date), 'yyyyMMdd');

    try {
      const response = await axios.get(`https://www.boredapi.com/api/activity?type=recreational`);
      const data = response.data;

      const messageText = `
─────────────────
العنوان: ${data.title || 'لا يوجد عنوان'}
─────────────────
التاريخ: ${formattedDate}
─────────────────
الوصف: ${data.description || 'لا يوجد وصف'}
─────────────────
الرابط: ${data.url || 'لا يوجد رابط'}
─────────────────
`;

      api.sendMessage(messageText, event.threadID, event.messageID);
    } catch (error) {
      console.error('Error fetching date data:', error);
      api.sendMessage('حدث خطأ أثناء محاولة جلب البيانات. حاول مرة أخرى لاحقاً.', event.threadID, event.messageID);
    }
  }
};