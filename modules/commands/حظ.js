const { getUserDate, updateUserDate } = require('../global/users');
const config = require('../../config/config');
const logger = require('../system/logger');

module.exports = {
  name: 'حظ',
  type: '❍ الالـعاب ❍',
  version: "1.5.0",
  otherName: ['luck', 'wheel'],
  hasPermission: 0,
  description: 'لعبة عجلة الحظ',
  execute: async function(api, event) {
      const itemsPrize = ['كتاب', 'قلم', 'سيف', 'قوة سحرية', 'هاتف', 'سيارة', 'كاتشب', 'ملابس', 'كلب', 'قط', ,'نظارة', 'كيبورد غير معاق', 'نكتة', 'طعام', 'ملعقة', 'مكنة حلاقة', 'سلاح']
    try {
      const getRandomAmount = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
      const getRandomItimes = itemsPrize[Math.floor(Math.random() * itemsPrize.length)];
      const prizes = [
        `مبروك! ربحت ${getRandomAmount(300, 1200)} $!`,
        `حظ سيء! خسرت ${getRandomAmount(200, 600)} $!`,
        `مبروك! ربحت ${getRandomAmount(100, 500)} exp!`,
        `حظ سيء! خسرت ${getRandomAmount(50, 200)} exp!`,
        `مبروك! ربحت مضاعفة اموالك الحالية!`,
        `حظ سيء! خسرت كل اموالك!\nلم يتبقي لك شي حتي كرامتك انتهت`,
        `مبروك! ربحت 50 نقطة صحة!`,
        `حظ سيء! خسرت 20 نقطة صحة!`,
        `مبروك! ربحت اداة جديدة ${getRandomItimes}`,
        `مبروك! ربحت خصم 10% على الشراء القادم!`,
        `مبروك! ربحت 200 نقطة exp!`,
        `حظ سيء! خسرت 100 نقطة exp!`
      ];

      const user = await getUserDate(event.senderID);
      if (!user) {
        setReachion(api, `:smirk:`, event.messageID)
        api.sendMessage(
`────────
 خطـــــأ  
────────
 لا يمكن العثور على معلومات المستخدم
────────
`, event.threadID, event.messageID);
        return;
      }

      if (user.health < 40) {
        setReachion(api, `:smirk:`, event.messageID)
        api.sendMessage(
`────────
 لا يمكنك اللعب
────────
 نقاط صحتك أقل من 40. يرجى زيادة نقاط صحتك قبل اللعب مرة أخرى.
────────
`, event.threadID, event.messageID);
        return;
      }

      const prize = prizes[Math.floor(Math.random() * prizes.length)];
      let message = `
────────
 نتيجة عجلة الحظ
────────
 ${prize}
────────
`;

      if (prize.includes('ربحت')) {
        if (prize.includes('مضاعفة اموالك الحالية')) {
          user.money *= 2;
        } else if (prize.includes('نقطة صحة')) {
          const healthPoints = parseInt(prize.match(/\d+/));
          user.health += healthPoints;
        } else if (prize.includes('exp')) {
          const expPoints = parseInt(prize.match(/\d+/));
          user.exp = (user.exp || 0) + expPoints;
        } else if (prize.includes('نقطة exp')) {
          const expPoints = parseInt(prize.match(/\d+/));
          user.exp = (user.exp || 0) + expPoints;
        } else if (prize.includes('اداة جديدة')) {
          user.items = (user.items || []).concat(getRandomItimes);
        } else if (prize.includes('خصم 10%')) {
          user.discount = 10;
        } else {
          const pointsWon = parseInt(prize.match(/\d+/));
          user.money += pointsWon;
        }
        message += `رصيدك الحالي: ${user.money} $.\nنقاط صحتك الحالية: ${user.health}.`;
        if (user.exp) message += `\nنقاط خبرتك الحالية: ${user.exp}.`;
        if (user.items) message += `\nلديك في خزنتك: ${user.items}.`;
        if (user.discount) message += `\nخصمك الحالي: ${user.discount}%.`;
      } else {
        if (prize.includes('خسرت كل اموالك')) {
          user.money = 0;
        } else if (prize.includes('نقطة صحة')) {
          const healthPoints = parseInt(prize.match(/\d+/));
          user.health -= healthPoints;
        } else if (prize.includes('exp')) {
          const expPoints = parseInt(prize.match(/\d+/));
          user.exp = (user.exp || 0) - expPoints;
        } else if (prize.includes('نقطة exp')) {
          const expPoints = parseInt(prize.match(/\d+/));
          user.exp = (user.exp || 0) - expPoints;
        } else {
          const pointsLost = parseInt(prize.match(/\d+/));
          user.money -= pointsLost;
        }
        user.health -= 10; // نقص 10 نقاط صحة إضافية عند الخسارة
        message += `رصيدك الحالي: ${user.money} $.\nنقاط صحتك الحالية: ${user.health}.`;
        if (user.exp) message += `\nنقاط خبرتك الحالية: ${user.exp}.`;
      }
      setReachion(api, `:slot_machine:`, event.messageID)
      await updateUserDate(event.senderID, user);
      api.sendMessage(message, event.threadID, event.messageID);
    } catch (error) {
      logger.error(`Error in حظ command: ${error}`);
      api.sendMessage('حدث خطأ أثناء تنفيذ لعبة الحظ', event.threadID, event.messageID);
    }
  }
};

async function setReachion(api, reachion, messageID) {
  api.setMessageReaction(reachion, messageID, (err) => {
    if (err) console.error('Filed Set Reachion ', err)
  })
}