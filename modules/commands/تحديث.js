const { getGroupData, saveNewGroup, updateGroupData } = require('../global/thread');
const fs = require('fs');
const path = require('path');
const config = require('../../config/config');
const { getUserDate } = require('../global/users');
const logger = require('../system/logger'); // Assuming there is a logger file for logging
const cmdPath = path.join(__dirname, '../commands');

module.exports = {
  name: 'تحديث',
  description: 'تحديث بيانات المجموعة والأوامر المتاحة',
  hasPermission: 2,
  execute: async (api, event) => {
    const { threadID, messageID, senderID } = event;
    const { sendMessage, setMessageReaction } = api;
    const user = await getUserDate(senderID);

    if (!user) {
      sendMessage('══════════\nليس لديك حساب مسجل.\n══════════', threadID, messageID);
      return;
    }

    if (!user.isAdmin) {
      sendMessage('═════\nلا توجد لديك الصلاحيات الكافية.\n═════', threadID, messageID);
      return;
    }

    const startTime = Date.now();

    // تأكيد التحديث
    

      // التحقق من حالة الاتصال
      
      // تحديث بيانات المجموعة
      resetGroupData(api, threadID, messageID)
        .then(async (groupResult) => {
          // إعادة تعيين الأوامر
          const commands = await resetCmd(cmdPath);

          const endTime = Date.now();
          const duration = ((endTime - startTime) / 1000).toFixed(2);
          const updateTime = new Date().toLocaleString('ar-EG', { timeZone: 'Africa/Cairo' });

          sendMessage(`═══════════\nتم تحديث بيانات المجموعة بنجاح ✅\n═══════════\nتم إعادة تحميل ${commands.length} أمر بنجاح.\nالوقت المستغرق: ${duration} ثانية\nالوقت: ${updateTime}\n══════════`, threadID, messageID);

          // إرسال تقرير إلى صاحب الحساب
          await sendPrivateReport(api, senderID, groupResult, commands.length, duration, updateTime);
        })
        .catch((error) => {
          logger.error('Error updating group data:', error);
          sendMessage('حدث خطأ أثناء تحديث البيانات. الرجاء المحاولة لاحقًا.', threadID, messageID);
        });
    }
  }


async function resetGroupData(api, threadID, messageID) {
  const groupData = await getGroupData(threadID);

  return new Promise((resolve, reject) => {
    api.getThreadInfo(threadID, async (err, threadInfo) => {
      if (err) {
        console.error('Error fetching thread info:', err);
        return reject('Error fetching thread info');
      }

      const groupName = threadInfo.name;
      const groupAdmins = threadInfo.adminIDs.map(admin => admin.id);
      const groupMembers = threadInfo.participantIDs.map(member => member.id);
      const groupMessageCount = threadInfo.messageCount;
      const groupCreationTime = threadInfo.timestamp;
      
      const groupPhoto = threadInfo.imageSrc || ''
      

      await updateGroupData(groupData.id, {
        name: groupName,
        admins: groupAdmins,
        members: groupMembers,
        messageCount: groupMessageCount,
        creationTime: groupCreationTime,
        img: groupPhoto,
      });

      api.sendMessage('═══════════\nتم تحديث بيانات المجموعة ✅\n══════════', threadID, messageID);
      resolve({
        groupName,
        admins: groupAdmins.length,
        members: groupMembers.length,
        messageCount: groupMessageCount,
        creationTime: new Date(groupCreationTime).toLocaleString('ar-EG', { timeZone: 'Africa/Cairo' }),
       
        img: groupPhoto,
        
      });
    });
  });
}

async function resetCmd(commandsPath) {
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
  const commands = [];

  for (const file of commandFiles) {
    const command = require(path.join(commandsPath, file));
    commands.push(command);
  }

  if (commands.length > 0) {
    logger.custom('Load Commands Successfully', 'COMMANDS', '\x1b[93m');
  }
  return commands;
}


async function sendPrivateReport(api, userID, groupResult, commandCount, duration, updateTime) {
  const report = `تقرير تحديث البيانات:
  اسم المجموعة: ${groupResult.groupName}
  عدد المدراء: ${groupResult.admins}
  عدد الأعضاء: ${groupResult.members}
  عدد الرسائل: ${groupResult.messageCount}
  تاريخ الإنشاء: ${groupResult.creationTime}
  صورة المجموعة: ${groupResult.photo}
  الأوامر التي تمت إعادة تحميلها: ${commandCount}
  الوقت المستغرق: ${duration} ثانية
  الوقت: ${updateTime}`;

  api.sendMessage(report, userID);
}
