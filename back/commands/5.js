const { getUser, updateUser } = require('../mongoose/user');
const log = require('../global/logger');

module.exports = {
  name: 'حظ',
  type: 'الالعاب',
  creator: 'لنك',
  updatedAt: '2024/7/20',
  version: "6.2.1",
  otherName: ['luck', 'wheel'],
  usageCount: 0,
  info: 'لعبة عجلة الحظ المثيرة',
  run: async function(api, event) {
    const emojis = ['🍏', '🍒', '🍋', '🍓', '🍋'];
    const getRandomAmount = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    const generateRandomEmoji = () => emojis[Math.floor(Math.random() * emojis.length)];
    const generateLuckPercentage = () => Math.floor(Math.random() * 101);

    try {
      const user = await getUser(event.senderID);
      if (!user) {
        api.sendMessage('⚠️ | خطأ: لا يمكن العثور على معلومات المستخدم', event.threadID, event.messageID);
        return;
      }
  if (user.money <= 0) {
    api.sendMessage('⚠️ | ليس لديك ما نقود لتلعب.', event.threadID, event.messageID)
  }
      // توليد أربعة رموز عشوائية
      const emoji1 = generateRandomEmoji();
      const emoji2 = generateRandomEmoji();
      const emoji3 = generateRandomEmoji();
      const luckPercentage = generateLuckPercentage();

      let message = `
────────
────────
${emoji1} ${emoji2} ${emoji3} 
────────
`;

      if (emoji1 === emoji2 && emoji2 === emoji3) {
        // المستخدم فائز كبير
        const prizeAmount = getRandomAmount(500, 1000);
        user.money += prizeAmount;
        message += `مبروك! ربحت الجائزة الكبرى: ${prizeAmount} جنيه\n`;
      } else if ((emoji1 === emoji2 || emoji2 === emoji3 || emoji3 === emoji1))  {
        // المستخدم فائز بجائزة متوسطة
        const prizeAmount = getRandomAmount(100, 300);
        user.money += prizeAmount;
        message += `مبروك! ربحت ${prizeAmount} جنيه\n`;
      } else {
        // المستخدم خاسر
        const lossAmount = getRandomAmount(100, 500);
        user.money -= lossAmount;
        message += `حظ سيء! خسرت ${lossAmount} جنيه\n`;
      }

      
      const randomChance = Math.random();
      if (randomChance < 0.05) {
        
        const bonusPrize = 10000;
        user.money += bonusPrize;
        message += `حظ رائع! ربحت جائزة إضافية قدرها ${bonusPrize} جنيه\n`;
      } else if (randomChance < 0.10) {
        
        const hugeLoss = getRandomAmount(2000, 5000);
        user.money -= hugeLoss;
        message += `سوء حظ كبير! خسرت ${hugeLoss} جنيه\n`;
      } else if (randomChance < 0.15) {
        user.money *= 2;
        message += `حظ مميز! تم مضاعفة رصيدك\n`;
      } else if (randomChance < 0.20) {
        user.money = 0;
        message += `سوء حظ كبير! خسرت كل رصيدك!\n`;
      }

      message += `◈ رصيدك الحالي: ${user.money} جنيه`;

      await updateUser(event.senderID, user);
      api.sendMessage(message, event.threadID, event.messageID);
    } catch (error) {
      log.error(`Error in حظ command: ${error}`);
      api.sendMessage('حدث خطأ أثناء تنفيذ لعبة الحظ', event.threadID, event.messageID);
    }
  }
};
