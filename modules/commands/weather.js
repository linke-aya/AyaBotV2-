const axios = require('axios');

module.exports = {
  name: 'طقس',
  description: 'استخدم Open-Meteo API لجلب معلومات الطقس',
  execute: async (api, event) => {
    const args = event.body.split(' ').slice(1);
    const city = args.join(' ');

    if (!city) {
      return api.sendMessage('يرجى توفير اسم المدينة.', event.threadID, event.messageID);
    }

    try {
      const response = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=35&longitude=139&current_weather=true`);
      
      const weatherData = response.data.current_weather;
      const message = `──────────\n
      الطقس في ${city}:\n══════════
      درجة الحرارة: ${weatherData.temperature}°C
      سرعة الرياح: ${weatherData.windspeed} كم/ساعة
      اتجاه الرياح: ${weatherData.winddirection}°
      `;

      api.sendMessage(message, event.threadID, event.messageID);
    } catch (error) {
      console.error('Error fetching weather information:', error);
      api.sendMessage('حدث خطأ أثناء محاولة الحصول على معلومات الطقس. حاول مرة أخرى لاحقاً.', event.threadID, event.messageID);
    }
  }
};