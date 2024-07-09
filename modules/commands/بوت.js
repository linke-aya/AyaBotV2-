const { getAllGroups, deleteGroupData } = require('../global/thread'); // استيراد الدوال اللازمة
const { getUserDate } = require('../global/users')
module.exports = {
  name: 'فورمات',
  description: 'يمحو جميع بيانات المجموعات.',
  hasPermission: 2, // الصلاحيات
  execute: async (api, event) => {
    const { threadID, messageID, senderID } = event;
    const { sendMessage } = api;

    const user = await getUserDate(senderID);
    if (!user || !user.isAdmin) {
      sendMessage('══════════\nليس لديك الصلاحيات اللازمة لاستخدام هذا الأمر\n══════════', threadID, messageID);
      return;
    }

    try {
      const groups = await getAllGroups(); // الحصول على جميع المجموعات
      let successCount = 0;
      let failCount = 0;

      for (const group of groups) {
        try {
          await deleteGroupData(group.id); // محو بيانات المجموعة
          successCount++;
        } catch (error) {
          console.error(`Failed to delete group ${group.id}:`, error);
          failCount++;
        }
      }

      sendMessage(`══════════\nتم محو بيانات ${successCount} مجموعة بنجاح.\nفشل في محو بيانات ${failCount} مجموعة.\n══════════`, threadID, messageID);
    } catch (error) {
      console.error('Error fetching groups:', error);
      sendMessage('══════════\nحدث خطأ أثناء محاولة محو بيانات المجموعات.\n══════════', threadID, messageID);
    }
  }
};