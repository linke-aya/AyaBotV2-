const { getGroupData, acceptGroup, saveNewGroup } = require('../global/thread');
const fs = require('fs');
const path = require('path');
const config = require('../../config/config');
const { getUserDate } = require('../global/users');

module.exports = {
  name: "موافقة",
  type: '❍ المـطـور ❍',
  otherName: ["قبول"],
  execute: async (api, event) => {
    const senderId = event.senderID;
    const user = await getUserDate(senderId);
    if (!user || (!user.isAdmin && senderId !== config.admin)) {
      return;
    }

    const args = event.body.trim().split(/ +/);
    const groupID = args[1] || event.threadID;

    try {
      let groupData = await getGroupData(groupID);
      if (!groupData) {
        // إذا لم تجد بيانات المجموعة، فاحصل على معلومات المجموعة واحفظها
        await api.getThreadInfo(groupID, async (err, threadInfo) => {
          if (err) {
            console.error('Error fetching thread info:', err);
            return console.error('Error fetching thread info');
          }

          const groupName = threadInfo.name;
          const groupAdmins = threadInfo.adminIDs.map(admin => admin.id);
          const groupMembers = threadInfo.participantIDs
          const groupMessageCount = threadInfo.messageCount;
          const groupCreationTime = threadInfo.timestamp;
          const groupPhoto = threadInfo.imageSrc || '';

          await saveNewGroup({
            id: groupID,
            prefix: '.',
            name: groupName,
            admins: groupAdmins,
            members: groupMembers,
            messageCount: groupMessageCount,
            creationTime: groupCreationTime,
            img: groupPhoto,
            status: false
          });
          await processGroup(api, event, groupData, groupID)
        });
     
      } else {
        // إذا وجدت بيانات المجموعة، استدعِ الدالة لمعالجة المجموعة
        await processGroup(api, event, groupData, groupID);
      }
    } catch (e) {
      console.error('Error processing group:', e);
    }
  }
};

async function processGroup(api, event, groupData, groupID) {
  if (!groupData.status) {
    await acceptGroup(groupID);

    // تعيين كنية البوت
    api.changeNickname(`${config.BOT_NAME} [ ${groupData.prefix} ]`, groupID, api.getCurrentUserID());

    const gifPath = path.resolve(__dirname, '../cache/1.gif');

    // التحقق من وجود الصورة في المسار المحدد
    if (!fs.existsSync(gifPath)) {
      return api.sendMessage('لم يتم العثور على الصورة في المسار المحدد.', event.threadID);
    }

    // إرسال رسالة الموافقة مع الصورة المحددة
    api.sendMessage({
      body: `───────────
تم القــبول      
───────────
──────────────
${config.BOT_NAME}
──────────────
تمت الموافقة على المجموعة 
اكتب ${groupData.prefix}اوامر 
لرؤية الأوامر المتاحة 
في حال وجود خطأ، استخدم 
${groupData.prefix}ابلاغ
للإبلاغ عن مشكلة للمطور     
──────────────
──────────────`,
      attachment: fs.createReadStream(gifPath)
    }, groupID);
  }
}
