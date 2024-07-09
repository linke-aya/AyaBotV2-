const axios = require('axios');
const config= require('../../config/config')

module.exports = {
  name: "اقتباس",
  type: '❍ النــصوص ❍',
  version: '1.2.0',
  otherName: ['إقتباس','اقتبس'] ,
  description: 'احصل على اقتباس عشوائي',
  allowedUsers: 'الجميع',
  hasPermission: 0,
  usage: 'اقتباس',
  creator: 'لــنك',
  execute: async (api, event, commands) => {
    try {
      const response = await axios.get('https://api.quotable.io/random');

      if (response.status === 200) {
        const quote = response.data.content;
        const author = response.data.author;

        const quoteMessage = `─────────────
 ${author}
─────────────
─────────────
${quote}
─────────────
`;
        
        api.sendMessage(quoteMessage, event.threadID, event.eventID);
      } else {
        api.sendMessage(`╭──────────
   خـــــــطأ   │
╰──────────
╭──────────────
حدث خطأ في النظام │
╰──────────────
`, event.threadID, event.eventID);
      }
    } catch (error) {
      api.sendMessage(`╭──────────
   خـــــــطأ   │
╰──────────
╭──────────────
حدث خطأ في النظام │
╰──────────────
`, event.threadID, event.eventID);
      
    }
  }
};
