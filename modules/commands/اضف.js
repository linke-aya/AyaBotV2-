const { getUserData } = require('../global/users');

module.exports = {
  name: 'اضف',
  type: '❍ المجمـوعات ❍',
  hasPermission: 0,
  version: '1.0.0',
  description: 'إضافة عضو إلى المجموعة باستخدام معرفه',
  execute: async function(api, event) {
    const args = event.body.split(' ');
    if (args.length < 2) {
      api.sendMessage('🚫 يرجى تقديم معرف المستخدم 🚫', event.threadID, event.messageID);
      return;
    }

    const userId = args[1];

    api.addUserToGroup(userId, event.threadID, (err) => {
      if (err) {
        api.sendMessage('🚫 حدث خطأ أثناء إضافة المستخدم إلى المجموعة 🚫', event.threadID, event.messageID);
        console.error(err);
      } else {
        api.sendMessage(`──────────\n✅ تم إضافة المستخدم بنجاح إلى المجموعة \n──────────`, event.threadID, event.messageID);
      }
    });
  }
};