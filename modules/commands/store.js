const { setReachion, sendMessage, reply } = require('../system/message');
const { getUserDate, updateUserDate } = require('../global/users');
const { getGroupData, getAllGroups, updateGroupData } = require('../global/thread');
const { getWareData, addNewWare, deleteWare, updateWare, getAllWare } = require('../global/store');

module.exports = {
  name: 'متجر',
  type: '❍ الـاموال ❍',
  otherName: ['ستور', 'store'],
  version: '2.0.0',
  description: 'قم ببيع وشراء المنتجات',
  execute: async (api, event) => {
    const { threadID, messageID, senderID } = event;
    
    try {
      const seller = await getUserDate(senderID);
      
      if (!seller) {
        await reply(api, threadID, messageID, '───────\nليس لديك حساب قم\nبانشاء واحد\n───────');
        await setReachion(api, '❌', messageID);
        return;
      }

      if (seller && seller.loggedIn) {
        const wares = await getAllWare();
        
        if (!wares || wares.length < 1) {
          await setReachion(api, '😿', messageID);
          await reply(api, threadID, messageID, '──────────────\nانتهت جميع المنتجات\n─────────────');
          return;
        }

        const wareDetails = await Promise.all(wares.map(async (info) => {
          const ownerData = await getUserDate(info.owner);
          return `\nاسم المنتج   ${info.name} \nمعلومات: ${info.info}\nالسعر: ${info.prize}\nالنوع: ${info.type}\nالمالك: ${ownerData ? ownerData.name : 'غير معروف'}\n`;
        }));

        const list = wareDetails.join('\n\n═══════════════\n');
        await reply(api, threadID, messageID, `─────────────────\n${list}\n─────────────────`);
      }
    } catch (error) {
      console.error('Error executing store command:', error);
      await reply(api, threadID, messageID, 'حدث خطأ أثناء تنفيذ الأمر. حاول مرة أخرى لاحقاً.');
    }
  }
};