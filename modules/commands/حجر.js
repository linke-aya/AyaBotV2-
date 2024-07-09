const { getUserDate, updateUserDate } = require('../global/users'); // افترضنا وجود هذه الدوال لإدارة بيانات المستخدمين

module.exports = {
  name: 'لعبة',
  type: '❍ الالـعاب ❍',
  description: 'لعبة حجر ورقة مقص',
  hasPermission: 0,
  usage: 'حجر ورقة مقص [اختيارك: حجر، ورقة، مقص]',
  execute: async (api, event) => {
    const choices = ['حجر', 'ورقة', 'مقص'];
    const userChoice = event.body.split(' ')[1];

    if (!choices.includes(userChoice)) {
      api.sendMessage('يرجى اختيار أحد: حجر، ورقة، مقص.', event.threadID, event.messageID);
      return;
    }

    const botChoice = choices[Math.floor(Math.random() * choices.length)];
    let result;
    const userId = event.senderID;
    let userData = await getUserDate(userId);

    if (!userData) {
      api.sendMessage('─────────────────\nلا يمكن العثور على بيانات المستخدم.\n───────────────── يرجى التأكد من تسجيل الدخول.', event.threadID, event.messageID);
      return;
    }

    if (userChoice === botChoice) {
      result = 'تعادل!';
      api.sendMessage(`────────\nاختيارك: ${userChoice} \n────────\nاختيار البوت: ${botChoice}\n────────\nالنتيجة: ${result}`, event.threadID, event.messageID);
    } else if (
      (userChoice === 'حجر' && botChoice === 'مقص') ||
      (userChoice === 'ورقة' && botChoice === 'حجر') ||
      (userChoice === 'مقص' && botChoice === 'ورقة')
    ) {
      result = 'أنت الفائز!';
      const reward = Math.floor(Math.random() * 401) + 100; // نقود عشوائية بين 100 و 500
      userData.money += reward;
      api.sendMessage(`────────\nاختيارك: ${userChoice} \n────────\nاختيار البوت: ${botChoice}\n────────\nالنتيجة: ${result}\n─────────\nحصلت على ${reward} نقود!`, event.threadID, event.messageID);
    } else {
      result = 'البوت هو الفائز!';
      const penalty = Math.floor(Math.random() * 401) + 100; // نقود عشوائية بين 100 و 500
      userData.money -= penalty;
      api.sendMessage(`────────\nاختيارك: ${userChoice} \n────────\nاختيار البوت: ${botChoice}\n────────\nالنتيجة: ${result}\n─────────\nخسرت ${penalty} نقود!`, event.threadID, event.messageID);
    }

    await updateUserDate(userId, userData);
  }
};