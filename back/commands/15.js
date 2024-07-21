const { getUser, updateUser } = require('../mongoose/user'); 

module.exports = {
  name: 'ادمن',
  info: 'خاص للمطور',
  usageCount: 0,
  usage: 'مش ادري',
  version: '1.0.1',
  type: 'المطور',
  updatedAt: '2024/7/20',
  run: async (api, event) => {
    const args = event.body.split(' ').slice(1);
    const action = args[0];
    
    const user = await getUser(event.senderID);
    const newAdmin = event.messageReply ? event.messageReply.senderID : args[1];
    
    if (!user) return;
    if (!user.isAdmin) {
      api.sendMessage('⚠️ | ليس لديك صلاحيات.', event.threadID, event.messageID);
      return;
    }
    if (!newAdmin) {
      api.sendMessage('⚠️ | استخدام خاطئ قم بالرد علي الشخص المراد\nاو قم بادخال معرفه.', event.threadID, event.messageID);
      return;
    }
    
    const newAdminAc = await getUser(newAdmin);
    if (!newAdminAc || !newAdminAc.haveAccuunt) {
      api.sendMessage('⚠️ | هذا المستخدم لا يملك حساب.', event.threadID, event.messageID);
      return;
    }
    
    switch (action) {
      case 'اضافة':
        newAdminAc.isAdmin = true;
        await updateUserDate(newAdmin, newAdminAc);
        api.sendMessage(`🐦 | رحبوا بالادمن الجديد ${newAdminAc.name} ايها الفلاحين.`, event.threadID, event.messageID);
        break;
        
      case 'حذف':
        newAdminAc.isAdmin = false;
        await updateUserDate(newAdmin, newAdminAc);
        api.sendMessage(`🌝 | تم طردته بنجاح.`, event.threadID, event.messageID);
        break;
      
      default:
        api.sendMessage('⚠️ | يرجي الاختيار بين \n1. اضافة\n2. حذف', event.threadID, event.messageID);
    }
  }
};
