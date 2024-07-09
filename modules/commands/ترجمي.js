const axios = require('axios');

module.exports = {
  name: 'وقت_الصلاة',
  type: '❍ اسـلامية ❍',
  hasPermission: 0,
  description: 'يحصل على أوقات الصلاة لمدينة معينة',
  execute: async (api, event) => {
    const args = event.body.split(' ').slice(1);
    const city = args.join(' ');

    if (!city) {
      return api.sendMessage('يرجى إدخال اسم المدينة. مثال: وقت_الصلاة مكة', event.threadID);
    }

    try {
      const response = await axios.get(`http://api.aladhan.com/v1/timingsByCity?city=${city}&country=Saudi Arabia&method=2&language=ar`);

      const timings = response.data.data.timings;

      const prayerTimes = ` ───────────
   وقت الصلاة  
 ───────────
 ────────────
    ${city}
 ────────────
 ────────────
             الفجر       
   ${timings.Fajr}
 ────────────
الشروق      
   ${timings.Sunrise}
 ────────────
  الظهر       
   ${timings.Dhuhr}
 ────────────
     العصر       
   ${timings.Asr}
 ────────────
المغرب      
   ${timings.Maghrib}
 ────────────
العشاء      
   ${timings.Isha}
 ────────────`
      api.sendMessage(prayerTimes, event.threadID, event.messageID);
    } catch (error) {
      console.error(error);
      api.sendMessage('حدث خطأ أثناء جلب أوقات الصلاة. تأكد من إدخال اسم المدينة بشكل صحيح وحاول مرة أخرى.', event.threadID, event.messageID);
    }
  }
};
