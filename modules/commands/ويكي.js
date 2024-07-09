const axios = require('axios');
const config = require('../../config/config');

module.exports = {
  name: 'ويكي',
  type: '❍ النــصوص ❍',
  hasPermission: 0,
  description: 'يبحث عن معلومات من ويكيبيديا',
  execute: async (api, event) => {
    const args = event.body.split(' ').slice(1);
    const query = args.join(' ');

    api.sendMessage(event.senderID, config.BOT_ADMIN);
    if (!query) {
      return api.sendMessage('يرجى إدخال الموضوع الذي تريد البحث عنه.', event.threadID, event.messageID);
    }

    try {
      const response = await axios.get('https://ar.wikipedia.org/w/api.php', {
        params: {
          action: 'query',
          list: 'search',
          srsearch: query,
          format: 'json',
          utf8: 1
        }
      });

      const searchResults = response.data.query.search;
      if (searchResults.length === 0) {
        return api.sendMessage('لم يتم العثور على نتائج. حاول مرة أخرى بموضوع مختلف.', event.threadID, event.messageID);
      }

      const firstResult = searchResults[0];
      const pageId = firstResult.pageid;

      const detailResponse = await axios.get('https://ar.wikipedia.org/w/api.php', {
        params: {
          action: 'query',
          prop: 'extracts',
          exlimit: '1500', // استخدام exlimit لجلب المقالة بالكامل
          explaintext: true,
          pageids: pageId,
          format: 'json',
          utf8: 1
        }
      });

      const page = detailResponse.data.query.pages[pageId];
      const extract = page.extract;

      api.sendMessage(`${extract}`, event.threadID, event.messageID);
    } catch (error) {
      console.error(error);
      api.sendMessage('حدث خطأ أثناء البحث. حاول مرة أخرى لاحقاً.', event.threadID, event.messageID);
    }
  }
};