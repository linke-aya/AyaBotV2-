const { getUserDate, updateUserDate } = require('../global/users');

module.exports = {
  name: 'هدية',
  type: '❍ الـاموال ❍',
  hasPermission: 0,
  otherName: ['هديه'],
  description: 'احصل على هدية يومية',
  execute: async (api, event) => {
    const Id = event.senderID;
    const user = await getUserDate(Id);

    if (!user) {
      api.sendMessage(
`────────────
 قم بانشاء حساب اولا
 ────────────`, event.threadID, event.messageID);
      return;
    }

    if (user.loggedIn === true) {
      const currentDate = new Date();
      const lastGiftDate = new Date(user.lastGiftDate || 0);
      const timeDiff = currentDate - lastGiftDate;
      const oneDay = 24 * 60 * 60 * 1000;

      if (timeDiff < oneDay) {
        const hoursRemaining = 24 - Math.floor(timeDiff / (60 * 60 * 1000));
        api.sendMessage(`يمكنك الحصول على هدية مرة واحدة فقط في اليوم. حاول مرة أخرى بعد ${hoursRemaining} ساعات.`, event.threadID, event.messageID);
        return;
      }

      await addMony(user, api, Id, event);
    }
  }
};

async function addMony(user, api, Id, event) {
  const free = Math.floor(Math.random() * 400) + 100; // رقم بين 100 و500
  const current = new Date().toISOString();
  user.money = user.money ? user.money + free : free; // إضافة الأموال بشكل صحيح
  user.lastGiftDate = current;

  // حفظ التحديثات الجديدة
  await updateUserDate(Id, user);

  const Mony = user.money;
  api.sendMessage(
`─────────────────────
 - لقد حصلت علي ${free}$ هدية 
 ─────────────────────`, event.threadID, event.messageID);
}