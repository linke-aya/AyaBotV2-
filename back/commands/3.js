const { getUser } = require('../mongoose/user');
const { getGroup, updateGroup } = require('../mongoose/thread');
const fs = require('fs');
const path = require('path');

module.exports = {
  name: "helpList",
  version: "1.0.0",
  description: "التحكم في صفحة الاوامر",
  type: 'نظام',
  count: 0,
  usages: "رقم",
  run: async (api, event, commands) => {
    const thread = event.threadID;
    const group = await getGroup(thread);
    if (!group) return;

    const args = event.body.split(' ').slice(1);
  

      const styleNumber = args[0]
      if (isNaN(styleNumber) || styleNumber < 1 || styleNumber > 10) {
        api.sendMessage("يرجى إدخال رقم نمط صحييح (1-10).", event.threadID, event.messageID);
        return;
      }

      // تحديث نمط المساعدة في المجموعة
      group.helpList = styleNumber;
      await updateGroup(group.id, group)

      api.sendMessage(`تم تغيير نمط القائمة إلى النمط رقم ${styleNumber}.`, event.threadID, event.messageID);
      return;
    }

}
