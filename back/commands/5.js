const { getUser, updateUser } = require('../mongoose/user');
const log = require('../global/logger');

module.exports = {
  name: 'حظ',
  type: 'الالعاب',
  version: "6.1.0",
  otherName: ['luck', 'wheel'],
  usageCount: 0,
  info: 'لعبة عجلة الحظ المثيرة',
  run: async function(api, event) {
    const emojis = ['🍅', '🍏', '🍒', '🍋', '🍇', '🍉', '🍓', '🍑', '⭐', '🍀', '🎁'];
    const getRandomAmount = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    const generateRandomEmoji = () => emojis[Math.floor(Math.random() * emojis.length)];
    const generateLuckPercentage = () => Math.floor(Math.random() * 101);

    try {
      const user = await getUser(event.senderID);
      if (!user) {
        api.sendMessage(
          `خطأ: لا يمكن العثور على معلومات المستخدم`, 
          event.threadID, 
          event.messageID
        );
        return;
      }

      // توليد أربعة رموز عشوائية
      const emoji1 = generateRandomEmoji();
      const emoji2 = generateRandomEmoji();
      const emoji3 = generateRandomEmoji();
      const emoji4 = generateRandomEmoji();
      const luckPercentage = generateLuckPercentage();

      let message = `
────────
🎉 نتيجة عجلة الحظ 🎉
────────
${emoji1} ${emoji2} ${emoji3} ${emoji4}
────────
نسبة الحظ: ${luckPercentage}%
────────
`;

      if (emoji1 === emoji2 && emoji2 === emoji3 && emoji3 === emoji4) {
        // المستخدم فائز كبير
        const prizeAmount = getRandomAmount(5000, 10000);
        user.money += prizeAmount;
        message += `🎉 مبروك! ربحت الجائزة الكبرى: ${prizeAmount} $! 🎉\n`;
      } else if ((emoji1 === emoji2 && emoji2 === emoji3) || 
                 (emoji2 === emoji3 && emoji3 === emoji4) || 
                 (emoji1 === emoji3 && emoji3 === emoji4) ||
                 (emoji1 === emoji2 && emoji2 === emoji4)) {
        // المستخدم فائز بجائزة متوسطة
        const prizeAmount = getRandomAmount(1000, 3000);
        user.money += prizeAmount;
        message += `🎉 مبروك! ربحت ${prizeAmount} $! 🎉\n`;
      } else if (emoji1 === emoji2 || emoji2 === emoji3 || emoji3 === emoji4 || emoji1 === emoji3 || emoji1 === emoji4 || emoji2 === emoji4) {
        // المستخدم فائز بجائزة صغيرة
        const prizeAmount = getRandomAmount(200, 500);
        user.money += prizeAmount;
        message += `🎉 مبروك! ربحت ${prizeAmount} $! 🎉\n`;
      } else {
        // المستخدم خاسر
        const lossAmount = getRandomAmount(100, 500);
        user.money -= lossAmount;
        message += `😔 حظ سيء! خسرت ${lossAmount} $! 😔\n`;
      }

      // فرص عشوائية إضافية
      const randomChance = Math.random();
      if (randomChance < 0.05) {
        // فرصة صغيرة للجائزة الكبرى
        const bonusPrize = 10000;
        user.money += bonusPrize;
        message += `🎉 حظ رائع! ربحت جائزة إضافية قدرها ${bonusPrize} $! 🎉\n`;
      } else if (randomChance < 0.10) {
        // فرصة صغيرة لخسارة كبيرة
        const hugeLoss = getRandomAmount(2000, 5000);
        user.money -= hugeLoss;
        message += `😔 سوء حظ كبير! خسرت ${hugeLoss} $! 😔\n`;
      } else if (randomChance < 0.15) {
        // فرصة صغيرة لمضاعفة الرصيد
        user.money *= 2;
        message += `🎉 حظ مميز! تم مضاعفة رصيدك! 🎉\n`;
      } else if (randomChance < 0.20) {
        // فرصة صغيرة لخسارة الرصيد بالكامل
        user.money = 0;
        message += `😔 سوء حظ كبير! خسرت كل رصيدك! 😔\n`;
      }

      message += `رصيدك الحالي: ${user.money} $.`;

      await updateUser(event.senderID, user);
      api.sendMessage(message, event.threadID, event.messageID);
    } catch (error) {
      log.error(`Error in حظ command: ${error}`);
      api.sendMessage('حدث خطأ أثناء تنفيذ لعبة الحظ', event.threadID, event.messageID);
    }
  }
};