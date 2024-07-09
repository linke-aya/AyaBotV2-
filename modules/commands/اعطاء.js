const { getUserDate, updateUserDate, sendFriendRequest, acceptFriendRequest, deleteUserData, saveNewUser } = require('../global/users');
const config = require('../../config/config');

module.exports = {
  name: 'اعطي',
  type: '❍ الـاموال ❍',
  version: "1.1.0",
  otherName: ['صدقة'],
  hasPermission: 2,
  description: 'يضيف نقود إلى حساب مستخدم محدد',
  execute: async function(api, event) {
    try {
      const sender = await getUserDate(event.senderID);
      if (!sender) return;
      if (!sender.isAdmin) {
        api.sendMessage(
`────────
 خطـــــأ  
────────
────────
  هذا الامر  
خاص للمطور 
────────
`, event.threadID, event.messageID);
        return;
      }

      const args = event.body.split(' ');
      let userId = args[3];
      const amount = parseInt(args[2]);
      const type = args[1]
      if (!userId) {
        if (event.messageReply) {
          userId = event.messageReply.senderID;
        } else {
          api.sendMessage('يرجي الرد علي رسالة الشخص المراد او ادخال معرفه.', event.threadID, event.messageID);
          return;
        }
      }

      if (!amount || isNaN(amount) || amount <= 0) {
        api.sendMessage('استخدام خاطئ \n يرجى كتابة المبلغ بشكل صحيح', event.threadID, event.messageID);
        return;
      }
      
      const userData = await getUserDate(userId);

      if (!userData) {
        api.sendMessage(
`────────
 خطـــــأ  
────────
  هذا المستخدم غير متوافر
────────
`, event.threadID, event.messageID);
        return;
      }
     
      if (type === 'نقود' || type === 'اموال') {
              userData.money += amount;

      }
      if (type === 'مستوي' || type === 'مسنوى') {
        userData.level += amount
      }
      if (type === 'صحة' ||  type === 'صحه') {
        userData.health += amount
      }
      if (type === 'نقاط' || type === 'exp') {
        userData.exp += amount
      }
      
      await updateUserDate(userId, userData);

      api.sendMessage(
`────────
 نجـــاح  
────────
 تم تحويل √       
  ${amount} ${type}
 إلى:        
 ${userData.name}
────────
`, event.threadID, event.messageID);

      api.sendMessage(
`────────
 هديــة  
────────
 تم استلام √       
 ${amount} ${type}
 من المطور    
 ${sender.name}
────────
`, userId);
    } catch (error) {
      console.error(error);
    }
  }
};
