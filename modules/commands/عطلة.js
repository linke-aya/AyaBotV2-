const axios = require('axios');

module.exports = {
  name: "عطلة",
  type: '❍ الـوسائط ❍',
  version: "1.0.0",
  hasPermission: 0,
  description: "يحصل على العطلات الرسمية في بلد معين",
  execute: async (api, event) => {
    const args = event.body.split(' ').slice(1); // استخراج الأرجومنت بعد اسم الأمر
    const countryCode = args[0] || 'US'; // استخدام كود الدولة المرسل، وإذا لم يُرسل أي كود، استخدام 'US' كافتراضي
    const year = new Date().getFullYear(); // الحصول على السنة الحالية

    try {
      // إرسال طلب إلى API
      const response = await axios.get(`https://date.nager.at/Api/v2/PublicHoliday/${year}/${countryCode}`);
      
      // استخراج بيانات العطلات
      const holidays = response.data;

      if (holidays.length === 0) {
        return api.sendMessage('لم يتم العثور على عطلات رسمية لهذه الدولة.', event.threadID, event.messageID);
      }

      // تكوين رسالة تحتوي على العطلات الرسمية
      let message = `──────────\nالعطلات الرسمية في الدولة ${countryCode} لعام ${year}:\n──────────\n`;
      holidays.forEach(holiday => {
        message += `- ${holiday.date}: ${holiday.localName} (${holiday.name})\n──────────`;
      });

      // إرسال الرد للمستخدم
      api.sendMessage(message, event.threadID, event.messageID);

    } catch (error) {
      console.error('Error fetching from Nager.Date API:', error);
      api.sendMessage('حدث خطأ أثناء محاولة الحصول على العطلات الرسمية. حاول مرة أخرى لاحقاً.', event.threadID, event.messageID);
    }
  }
};