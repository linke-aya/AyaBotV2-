const logger = require('../system/logger');
const config = require('../../config/config');
const { getGroupData, updateGroupData } = require('../global/thread'); // استيراد وظائف إدارة المجموعة
const { getUserDate } = require('../global/users')
module.exports = {
  name: "مغادرة",
  type: '❍ المـطـور ❍',
  otherName: ["غادر", "اخرج"],
  usage: 'مغادرة ‹ الكل ›',
  hasPermission: 1,
  description: 'يجعل البوت يغادر مجموعة معينة أو جميع المجموعات',

  execute: async (api, event) => {
    const args = event.body.split(' ').slice(1);
    const action = args[0];
    const senderId= event.senderID
    const user = await getUserDate(senderId)
    if ( senderId != config.admin || !user.isAdmin) {
      api.sendMessage(`───────────────
هذا الامر اكبر من استطاعتك
───────────────`, event.threadID, event.messageID);
      return;
    }
    handleLeave(api, event, action);
  }
};

async function handleLeave(api, event, target) {
  if (target === 'الكل') {
    api.getThreadList(20, null, ["INBOX"], async (err, list) => {
      if (err) {
        logger.error('فشل في جلب قائمة المحادثات:', err);
        return;
      }

      for (const thread of list) {
        await leaveGroup(api, thread.threadID);
      }
    });
  } else {
    const threadID = event.threadID;
    await leaveGroup(api, threadID);
  }
}

async function leaveGroup(api, threadID) {
  try {
    await api.sendMessage(
`───────────────
امر المطور بمغادرة المجموعة
───────────────`, threadID);
    const groupData = await getGroupData(threadID);
    if (groupData) {
      // تحديث حالة المجموعة إلى غير مقبولة
      await updateGroupData(threadID, { status: false });
    }
     
    await api.removeUserFromGroup(api.getCurrentUserID(), threadID, (err) => {
      if (err) {
        logger.error(err);
      } else {
        logger.info(`تم مغادرة المجموعة ${threadID} بنجاح`);
      }
    });
  } catch (error) {
    logger.error(error);
  }
}