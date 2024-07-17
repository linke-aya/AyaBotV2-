const { getUser } = require('../mongoose/user');
const { getGroup, updateGroup } = require('../mongoose/thread');
const fs = require('fs');
const path = require('path');

module.exports = {
  name: "list",
  version: "1.0.0",
  info: "التحكم في صفحة الاوامر",
  type: 'نظام',
  creator: 'لنك',
  usageCount: 0,
  usages: "رقم",
  run: async (api, event, commands) => {
    try {
      const thread = event.threadID;
      console.log(`Thread ID: ${thread}`);
      
      const group = await getGroup(thread);
      console.log(`Group: ${group}`);
      
      if (!group) {
        console.log('Group not found.');
        return;
      }

      const args = event.body.split(' ').slice(1);
      console.log(`Args: ${args}`);

      const styleNumber = args[0];
      if (isNaN(styleNumber) || styleNumber < 1 || styleNumber > 10) {
        api.sendMessage("⚠️ | يرجى إدخال رقم نمط صحيح .", event.threadID, event.messageID);
        return;
      }

      // تحديث نمط المساعدة في المجموعة
      group.helpList = styleNumber;
      await updateGroup(group.id, group);

      api.sendMessage(`ℹ️ | تم تغيير نمط القائمة إلى النمط رقم ${styleNumber}`, event.threadID, event.messageID);
    } catch (error) {
      console.error('Error in helpList command:', error);
    }
  }
};