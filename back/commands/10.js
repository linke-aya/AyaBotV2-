const axios = require('axios');

module.exports = {
  name: "سؤال",
  updatedAt: '2024/7/20',
  otherName: ['سوال', 'اجب'],
  type: 'الذكاء',
  version: "1.0.0",
  usageCount: 0,
  info: "يجيب على أسئلتك بنعم أو لا",
  run: async (api, event) => {
    try {
     
      const response = await axios.get('https://yesno.wtf/api');
      
   
      const answer = response.data.answer; 
      const imageUrl = response.data.image; 

    
      api.sendMessage({
        body: `${answer.toUpperCase()}`,
        attachment: await axios.get(imageUrl, { responseType: 'stream' }).then(res => res.data)
      }, event.threadID, event.messageID);

    } catch (error) {
      console.error('Error fetching from YesNo API:', error);
      api.sendMessage('⚠️ | حدث خطأ.', event.threadID, event.messageID);
    }
  }
};