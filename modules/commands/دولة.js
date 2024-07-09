const axios = require('axios');

module.exports = {
  name: 'دولة',
  type: '❍ الـوسائط ❍',
  description: "جلب معلومات عن دولة معينة",
  execute: async (api, event) => {
    const countryName = event.body.slice(event.body.indexOf(' ') + 1).trim(); // استخراج اسم الدولة من الرسالة

    if (!countryName) {
      return api.sendMessage('يرجى توفير اسم الدولة للحصول على المعلومات.', event.threadID, event.messageID);
    }

    try {
      const response = await axios.get(`https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}`);
      const country = response.data[0];

      if (!country) {
        return api.sendMessage('لم يتم العثور على دولة بهذا الاسم. يرجى التحقق من الاسم والمحاولة مرة أخرى.', event.threadID, event.messageID);
      }

      const reply = `
الاسم: ${country.name.common}
العاصمة: ${country.capital ? country.capital[0] : 'غير متوفرة'}
المنطقة: ${country.region}
التعداد السكاني: ${country.population}
العملة: ${Object.keys(country.currencies).map(key => `${country.currencies[key].name} (${country.currencies[key].symbol})`).join(', ')}
اللغة: ${Object.values(country.languages).join(', ')}
      `;

      api.sendMessage(reply, event.threadID, event.messageID);
    } catch (error) {
      console.error('Error fetching country information:', error);
      api.sendMessage('حدث خطأ أثناء محاولة الحصول على معلومات الدولة. حاول مرة أخرى لاحقاً.', event.threadID, event.messageID);
    }
  }
};