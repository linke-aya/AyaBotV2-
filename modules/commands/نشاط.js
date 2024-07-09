const axios = require('axios');

module.exports = {
  name: "ناسا",
  type: '❍ الـوسائط ❍',
  description: "احصل على صورة اليوم من وكالة ناسا",
  execute: async (api, event) => {
    const NASA_API_KEY = 'DEMO_KEY'; // استبدل DEMO_KEY بمفتاح API الخاص بك من وكالة ناسا
    
    try {
      const response = await axios.get(`https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`);
      const data = response.data;
      const title = data.title;
      const explanation = data.explanation;
      const imageUrl = data.url;
      const date = data.date;

      const message = {
        body: `───────────────\n📅 تاريخ: ${date}\n───────────────🌌 عنوان: ${title}\n\n───────────────📖 شرح: ${explanation}\n───────────────\n🌠 صورة:`,
        attachment: await getStreamFromURL(imageUrl)
      };

      api.sendMessage(message, event.threadID, event.messageID);
    } catch (error) {
      console.error('Error fetching NASA APOD:', error);
      api.sendMessage('حدث خطأ أثناء محاولة جلب صورة اليوم من وكالة ناسا. حاول مرة أخرى لاحقاً.', event.threadID, event.messageID);
    }
  }
};

async function getStreamFromURL(url) {
  try {
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream'
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching image stream:', error);
    throw error;
  }
}