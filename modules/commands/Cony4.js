const axios = require('axios');
const { setReachion } = require('../system/message'); // Assuming you have a utility for setting reactions

module.exports = {
  name: "نكتة",
  type: '❍ النــصوص ❍',
  otherName: ["joke"],
  usage: 'نكتة',
  description: 'احصل على نكتة عشوائية',

  execute: async (api, event) => {
    try {
      const response = await axios.get('https://v2.jokeapi.dev/joke/Any?lang=en');
      const joke = response.data;

      let jokeMessage;
      if (joke.type === 'single') {
        jokeMessage = joke.joke;
      } else {
        jokeMessage = `${joke.setup}\n\n${joke.delivery}`;
      }

      await setReachion(api, `😂`, event.messageID);
      api.sendMessage(jokeMessage, event.threadID, event.messageID);
    } catch (error) {
      console.error('Error fetching joke:', error);
      await setReachion(api, '❌', event.messageID);
      api.sendMessage('عذرًا، حدث خطأ أثناء جلب النكتة. حاول مرة أخرى لاحقًا.', event.threadID, event.messageID);
    }
  }
};