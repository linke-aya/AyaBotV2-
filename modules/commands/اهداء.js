const { getUserDate, updateUserDate } = require('../global/users'); // Replace with your actual user data functions

module.exports = {
  name: "اهداء",
  type: '❍ الـاموال ❍',
  otherName: ["تبادل_الأموال"],
  usage: 'تحويل_الأموال <اسم المستخدم أو الإيدي> <المبلغ>',
  hasPermission: 0,
  description: 'يتيح للمستخدمين تحويل الأموال لبعضهم البعض',

  execute: async (api, event) => {
    const args = event.body.split(' ').slice(1);
    if (args.length < 2) {
      api.sendMessage('الرجاء إدخال اسم المستخدم أو الإيدي والمبلغ الذي ترغب في تحويله', event.threadID, event.messageID);
      return;
    }

    const userInput = args[0].trim();
    const amount = parseFloat(args[1]);

    if (isNaN(amount) || amount <= 0) {
      api.sendMessage('المبلغ يجب أن يكون رقمًا إيجابيًا', event.threadID, event.messageID);
      return;
    }

    const senderId = event.senderID;
    const sender = await getUserDate(senderId);

    if (!sender) {
      api.sendMessage(
`──────────────────
  ╭─────────    
      خـــــطأ  
  ╰─────────
قم بانشاء حساب   

──────────────────`, event.threadID, event.messageID);
      return;
    }

    let receiver;
    if (userInput.match(/^[0-9a-fA-F]{24}$/)) {
      receiver = await getUserDate(userInput); // بحث باستخدام الإيدي
    } else {
      receiver = await getUserDate(userInput); // بحث باستخدام اسم المستخدم
    }

    if (!receiver) {
      api.sendMessage(
` ──────────────────
    ─────────    
      خـــــطأ   
    ─────────
  مستخدم غير موجود   
 
 ──────────────────`, event.threadID, event.messageID);
      return;
    }

    if (sender.money < amount) {
      api.sendMessage(
`──────────────────
   ─────────    
       خـــــطأ   
   ─────────
 هذا المبلغ اكبر من راس مالك  

──────────────────`, event.threadID, event.messageID);
      return;
    }

    try {
      // تحديث الرصيد للمرسل
      await updateUserDate(senderId, { money: sender.money - amount });

      // تحديث الرصيد للمستلم
      await updateUserDate(receiver.id, { money: receiver.money + amount });

      api.sendMessage(
`──────────────────
    ─────────    
      نجـــــــاح  
    ─────────
   تم تحويل مبلغ ${amount}$ الي 
    ${receiver.name}
──────────────────`, event.threadID, event.messageID);
    } catch (error) {
      api.sendMessage(
`──────────────────
    ─────────    
      خـــــطأ   
    ─────────
    حدث خطأ في النظام   
  
 ─────────────────`, event.threadID, event.messageID);
      console.error(error);
    }
  }
};