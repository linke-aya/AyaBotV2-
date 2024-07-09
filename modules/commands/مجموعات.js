const { getAllGroups } = require('../global/thread'); // استيراد دالة الحصول على كافة المجموعات
const { getUserDate } = require('../global/users');

module.exports = {
  name: 'اخطار',
  description: 'يقوم بإرسال رسالة إلى كافة المجموعات الموافق عليها.',
  hasPermission: 1, // تفاصيل الصلاحيات يمكن تعديلها حسب الحاجة
  usage: '[الرسالة]',
  execute: async (api, event) => {
    const message = event.body.split(' ').slice(1).join(' '); // استخراج الرسالة من الرسالة الواردة
    const user = await getUserDate(event.senderID)
    if (!user) return
    if(!user.isAdmin) {
     api.sendMessage('هذا الامر اكبر من راس مالك ', event.threadID, event.messageID)
    }
    const owner = user.name
    if (!message) {
      api.sendMessage('الرجاء إدخال رسالة لإرسالها إلى المجموعات الموافق عليها.', event.threadID, event.messageID);
      return;
    }

    try {
      const groups = await getAllGroups(); // الحصول على كافة المجموعات من قاعدة البيانات

      // تصفية المجموعات الموافق عليها
      const approvedGroups = groups.filter(group => group.status === true);
      const groupIds = approvedGroups.map(group => group.id);

      let successCount = 0;
      let failureCount = 0;

      // إرسال الرسالة إلى كل مجموعة باستخدام API الخاص بالمنصة
      await Promise.all(groupIds.map(async (groupId) => {
        try {
          await api.sendMessage(`════════════\n════════════\n رسالة من المطور ${owner}\n\n ${message}\n\n════════════`, groupId);
          successCount++;
        } catch (error) {
          console.error(`Felid Send Messages  To Group ${groupId}`, error);
          failureCount++;
        }
      }));

      api.sendMessage(`════════════\nتم ارسال الاشعار الي\n${successCount} مجموعة وفشل في ارسال \nالي${failureCount} مجموعة\n════════════`, event.threadID, event.messageID);
    } catch (error) {
      console.error('حدث خطأ أثناء إرسال الرسالة إلى المجموعات:', error);
      api.sendMessage('حدث خطأ أثناء إرسال الرسالة إلى المجموعات.', event.threadID, event.messageID);
    }
  }
};
