const config = require('../../config/config');
const { getGroupData, updateGroupData } = require('../global/thread');

module.exports = {
  name: 'بادئة',
  type: '❍ المجمـوعات ❍',
  hasPermission: 1,
  otherName: ["بادئه", "prefix"],
  version: "1.0.0",
  execute: async (api, event) => {
    const { threadID, messageID } = event;
    const args = event.body.split(' ').slice(1);
    const newPrefix = args[0];

    try {
      const group = await getGroupData(threadID);

      if (!newPrefix || newPrefix === '') {
        group.prefix = '';
        await updateGroupData(threadID, group);
        api.sendMessage(
          `──────────────
─────────    
تم حذف البادئة
─────────
──────────────`, threadID, messageID);
      } else if (newPrefix === 'الاصل' || newPrefix === 'نظام') {
        group.prefix = '.';
        await updateGroupData(threadID, group);
        api.sendMessage(
          `──────────────
─────────    
تم ارجاع البادئة الي .
─────────
──────────────`, threadID, messageID);
      } else {
        group.prefix = newPrefix;
        await updateGroupData(threadID, group);
        api.sendMessage(
          `──────────────
─────────    
تم تغيير البادئة الي ${newPrefix}
─────────
──────────────`, threadID, messageID);
      }
    } catch (error) {
      console.error('Error updating group prefix:', error);
      api.sendMessage('حدث خطأ أثناء تحديث البادئة.', threadID, messageID);
    }
  }
};