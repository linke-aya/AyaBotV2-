const { getUserDate } = require('../global/users');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const { getAllGroups, getGroupData } = require('../global/thread');
const commandsPath = path.join(__dirname, '../commands');

module.exports = {
  name: 'رست',
  description: 'يقوم بإعادة تشغيل البوت.',
  hasPermission: 2, // صلاحيات خاصة بالمسؤولين فقط
  execute: async (api, event) => {
    const { threadID, messageID, senderID } = event;
    const user = await getUserDate(senderID);

    if (!user) {
      api.sendMessage({ body: 'الرجاء تسجيل الدخول لاستخدام هذا الأمر.' }, threadID, () => {}, messageID);
      return;
    }

    if (!user.isAdmin) {
      api.sendMessage({ body: 'ليس لديك صلاحية استخدام هذا الأمر.' }, threadID, () => {}, messageID);
      return;
    }

    const startTime = Date.now();
    const commandFilesBefore = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    api.sendMessage({ body: 'جارٍ إعادة تشغيل البوت...' }, threadID, async (err, info) => {
      if (err) return 
      exec('pm2 restart Aya', async (error, stdout, stderr) => {
        const endTime = Date.now();
        const timeTaken = endTime - startTime;
        const restartTime = new Date(endTime).toLocaleString();

        if (error) {
          console.error(`خطأ: ${error}`);
          api.sendMessage({ body: 'حدث خطأ أثناء إعادة تشغيل البوت.' }, threadID, () => {}, messageID);
          return;
        }

        // إعادة تحميل الأوامر الجديدة
        const commandFilesAfter = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
        const newCommandsCount = commandFilesAfter.length - commandFilesBefore.length;
        const updatedCommandsCount = commandFilesBefore.filter(file => commandFilesAfter.includes(file)).length;

        // الحصول على حالة الأوامر
        const commandStatus = commandFilesAfter.map(file => {
          const command = require(path.join(commandsPath, file));
          return {
            name: command.name,
            description: command.description || 'بدون وصف',
            status: command.hasPermission ? 'نشطة' : 'غير نشطة'
          };
        });

        // الحصول على بيانات المجموعات
        const groups = await getAllGroups();
        const groupDetails = [];

        for (const group of groups) {
          const groupData = await getGroupData(group.id);
          await api.getThreadInfo(group.id, (err, threadInfo) => {
            if (err) {
              console.error(`خطأ في جلب معلومات المجموعة: ${err}`);
              return;
            }

            groupDetails.push({
              name: groupData.name,
              memberCount: groupData.members.length
            });
          });
        }

        const message = `
══════════
تم إعادة تشغيل البوت بنجاح في ${timeTaken} ملي ثانية.
وقت وتاريخ إعادة التشغيل: ${restartTime}
عدد الأوامر الجديدة: ${newCommandsCount}
عدد الأوامر التي تم تحديثها: ${updatedCommandsCount}

حالة الأوامر:
${commandStatus.map(cmd => `${cmd.name}: ${cmd.description}`).join('\n')}

تفاصيل المجموعات:
${groupDetails.map(group => `${group.name}: عدد الأعضاء: ${group.memberCount}`).join('\n')}
══════════
`;

        api.sendMessage({ body: message }, threadID, () => {}, messageID);
      });
    }, messageID);
  }
};