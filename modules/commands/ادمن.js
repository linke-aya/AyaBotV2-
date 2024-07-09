const { getUserDate, updateUserDate } = require('../global/users'); // Replace with your actual user data functions

module.exports = {
  name: 'ادمن',
  description: 'خاص للمطور',
  execute: async (api, event) => {
    const args = event.body.split(' ').slice(1);
    const action = args[0];
    
    const user = await getUserDate(event.senderID);
    const newAdmin = event.messageReply ? event.messageReply.senderID : args[1];
    
    if (!user) return;
    if (!user.isAdmin) {
      api.sendMessage('══════════\nهذا الامر اكبر من استطاعتك\n═══════════', event.threadID, event.messageID);
      return;
    }
    if (!newAdmin) {
      api.sendMessage('══════════\nقم بالرد على رسالة الشخص المرغوب أو ادخل المعرف مباشرة\n══════════', event.threadID, event.messageID);
      return;
    }
    
    const newAdminAc = await getUserDate(newAdmin);
    if (!newAdminAc) {
      api.sendMessage('════════════\nهذا المستخدم لا يمتلك حساب 🗿\n════════════', event.threadID, event.messageID);
      return;
    }
    
    switch (action) {
      case 'اضافة':
        newAdminAc.isAdmin = true;
        await updateUserDate(newAdmin, newAdminAc);
        api.sendMessage(`══════════\nرحبوا بالادمن الجديد ${newAdminAc.name}\nايها الفلاحين\n══════════`, event.threadID, event.messageID);
        break;
        
      case 'حذف':
        newAdminAc.isAdmin = false;
        await updateUserDate(newAdmin, newAdminAc);
        api.sendMessage(`══════════\nتمت ازالة ${newAdminAc.name} من دور الادمن\n══════════`, event.threadID, event.messageID);
        break;
      
      default:
        api.sendMessage('══════════\nيمكنك الاختيار بين:\n1. اضافة\n2. حذف\n══════════', event.threadID, event.messageID);
    }
  }
};