const axios = require('axios');

module.exports = {
  name: 'وقت_الصلاة',
  type: 'الدين',
  usageCount: 0,
  updatedAt: '2024/7/21',
  info: 'يحصل على أوقات الصلاة',
  run: async (api, event) => {
    const args = event.body.split(' ').slice(1);
    const city = args.join(' ');

    if (!city) {
      return api.sendMessage('⚠️| لم تدخل اسم المدينة.', event.threadID);
    }

    try {
      const response = await axios.get(`http://api.aladhan.com/v1/timingsByCity?city=${city}&country=Saudi Arabia&method=2&language=ar`);

      const timings = response.data.data.timings;

      const prayerTimes = 
 
    `『 ${city} 』

 
  ◈ الفجر  ${timings.Fajr}
 
  ◈ الشروق ${timings.Sunrise}
 
  ◈ الظهر ${timings.Dhuhr}

  ◈ العصر ${timings.Asr}
 
  ◈ المغرب ${timings.Maghrib}
 
  ◈ العشاء ${timings.Isha}`
      api.sendMessage(prayerTimes, event.threadID, event.messageID);
    } catch (error) {
      console.error(error);
      api.sendMessage('⚠️ | حدث خطأ تاكد من اسم المدينة وحاول مجدداً.', event.threadID, event.messageID);
   }
  }
};
