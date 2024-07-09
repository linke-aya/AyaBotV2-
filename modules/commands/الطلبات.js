const { getAllGroups } = require('../global/thread');
const { getUserDate } = require('../global/users');

module.exports = {
  name: 'طلبات',
  description: 'يعرض المجموعات التي انضم لها البوت والمجموعات المعلقة مع عدد الأعضاء.',
  hasPermission: 2,
  usage: '',
  execute: async (api, event) => {
    const { threadID, messageID, senderID } = event;
    const user = await getUserDate(senderID);

    if (!user) {
      api.sendMessage({ body: '══════════\nليس لديك حساب مسجل.\n══════════' }, threadID, messageID);
      return;
    }

    if (!user.isAdmin) {
      api.sendMessage({ body: '═════\nلا توجد لديك الصلاحيات الكافية.\n═════' }, threadID, messageID);
      return;
    }

    try {
      const groups = await getAllGroups(); // الحصول على كافة المجموعات من قاعدة البيانات

      const approvedGroups = groups.filter(group => group.status === true);
      const pendingGroups = groups.filter(group => group.status === false);
      
      const approvedList = approvedGroups.map(group => 
        `═══════════════\nالاسم: ${group.name}\nالايدي: ${group.id}\nعدد الأعضاء: ${group.members.length || 'غير معروف'}\n`);

      const pendingList = pendingGroups.map(group => 
        `\nاسم المجموعة: ${group.name}\nالايدي: ${group.id}\nعدد الأعضاء: ${group.members.length || 'غير معروف'}\n═══════════════`);

      const responseMessage = `
──────────────
المجموعات الموافق عليها:
──────────────
${approvedList.join('\n') || 'لا توجد مجموعات موافقة'}



──────────────
المجموعات المعلقة:
──────────────
${pendingList.join('\n') || 'لا توجد مجموعات معلقة حالياً.'}
      `;

      api.sendMessage({ body: responseMessage }, threadID, messageID);
    } catch (error) {
      console.error('حدث خطأ أثناء جلب المجموعات:', error);
      api.sendMessage({ body: 'حدث خطأ أثناء جلب المجموعات.' }, threadID, messageID);
    }
  }
};