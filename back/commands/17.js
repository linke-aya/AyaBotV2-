const { getUser, updateUser } = require('../mongoose/user')

module.exports = {
  name: 'عمل',
  version: '1.0.0',
  info: "قم بالعمل لكسب المال",
  type: 'العاب',
  updatedAt: '2024/7/24',
  creator: 'لنك',
  usageCount: 0,
  usages: "",
  run: async (api, event) => {

    const getRandomAmount = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
    const Ratio = Math.floor(Math.random() * 101)

    const user = await getUser(event.senderID)
    if (!user) {
      api.sendMessage('⚠️ | ليس لديك حساب.', event.threadID, event.messageID)
      return
    }
    const Jobs = [
     'الطب',
     'الطبخ',
     'التجارة',
     'الدعارة',
     'البرمجة',
     'التدريس',
     'الشرطة',
     'الطيران'
     ]
    const currentDate = new Date();
    const lastGiftDate = new Date(user.lastJobTime || 0)
    const timeDiff = currentDate - lastGiftDate;
    const oneDay = 24 * 60 * 60 * 1000

    if (timeDiff < oneDay) {
      const hoursRemaining = 24 - Math.floor(timeDiff / (60 * 60 * 1000));
      api.sendMessage(`⚠️ | لا يمكنك العمل الان عد بعد ${hoursRemaining}`, event.threadID, event.messageID);
      return;
    }

    const UserJob = Jobs[Math.floor(Math.random() * Jobs.length)]
    user.lastJobTime = currentDate
    await updateUser(user.id, user)
    let Amount
    switch (UserJob) {
      case 'الطب':
        let message = '🌝| لقد عملت في مجال الطب '

        if (Ratio <= 15) {

          Amount = getRandomAmount(1000, 5000)
          user.mony -= Amount
          await updateUser(user.id, user)
          message += `ولسوء الحظ فشلت في العملية وخسرت ${Amount} جنيه`
          api.sendMessage(message, event.threadID, event.messageID)
        }
        if (Ratio < 20 && Ratio >= 16) {
          message += `وكانت خبرتك قليلة لذا حصلت علي ${Amount} جنيه`
          api.sendMessage(message, event.threadID, event.messageID)
          Amount = getRandomAmount(500, 1000)
          user.mony += Amount
          await updateUser(user.id, user)
        }
        if (Ratio < 70 && Ratio >= 20) {
          message += `لقد دخلت عملية ونجحت في اكمالها وحصلت علي ${Amount} جنيه`
          api.sendMessage(message, event.threadID, event.messageID)
          Amount = getRandomAmount(1500, 2500)
          user.mony += Amount
          await updateUser(user.id, user)
        }
        if (Ratio >= 70) {
          message += `لقد انقذت حياة فتاة وحصلت علي ${Amount} جنيه`
          api.sendMessage(message, event.threadID, event.messageID)
          Amount = getRandomAmount(4000, 5000)
          user.mony += Amount
          await updateUser(user.id, user)
        }
        break;
      case 'الطبخ':
        user.lastJobTime = currentDate
        let message = '🍞 | لقد عملت في مجال الطبخ  '
        if (Ratio < 50) {
          message += `وطبخت كعكة طبخة سيئة وخسرت ${Amount} جنيه`

          api.sendMessage(message, event.threadID, event.messageID)
          Amount = getRandomAmount(100, 2000)
          user.mony -= Amount
          await updateUser(user.id, user)
        }
        if (Ratio >= 50) {
          message += `لقد طبخت طبخة مميزة وحصلت علي ${Amount} جنيه.`
          api.sendMessage(message, event.threadID, event.messageID)
          Amount = getRandomAmount(4000, 5000)
          user.mony += Amount
          await updateUser(user.id, user)
        }
        break;
      case 'التجارة':
        let message = '💲 |لقد عملت في مجال تجارة '
        if (Ratio <= 10) {
          message += `العصير وحصلت علي ${Amount} جنيه`
          api.sendMessage(message, event.threadID, event.messageID)
          Amount = getRandomAmount(1000, 2000)
          user.mony += Amount
          await updateUser(user.id, user)
        }
        if (Ratio <= 30 && Ratio > 11) {
          message += `الفواكه وحصلت علي ${Amount} جنيه`
          api.sendMessage(message, event.threadID, event.messageID)
          Amount = getRandomAmount(2000, 2500)
          user.mony += Amount
          await updateUser(user.id, user)
        }
        if (Ratio <= 50 && Ratio > 31) {
          message += `الحلويات وحصلت علي ${Amount} جنيه`
          api.sendMessage(message, event.threadID, event.messageID)
          Amount = getRandomAmount(2000, 2500)
          user.mony += Amount
          await updateUser(user.id, user)
        }
        if (Ratio <= 70 && Ratio > 51) {
          message += `الملابس وحصلت علي ${Amount} جنيه`
          api.sendMessage(message, event.threadID, event.messageID)
          Amount = getRandomAmount(3000, 4000)
          user.mony += Amount
          await updateUser(user.id, user)
        }
        if (Ratio < 90 && Ratio > 71) {
          message += `المخدرات وحصلت علي ${Amount} جنيه`
          api.sendMessage(message, event.threadID, event.messageID)
          Amount = getRandomAmount(4000, 5000)
          user.mony += Amount
          await updateUser(user.id, user)
        }
        if (Ratio >= 90) {
          message += `الماكولات وحصلت علي ${Amount} جنيه`
          api.sendMessage(message, event.threadID, event.messageID)
          Amount = getRandomAmount(2000, 3000)
          user.mony += Amount
          await updateUser(user.id, user)
        }
        break;

      case 'الدعارة':
        api.sendMessage(`🌝 | لقد نمت ليلة في الفراش وحصلت علي ${Amount} جنيه`, event.threadID, event.messageID)
        Amount = getRandomAmount(5000, 10000)
        user.mony += Amount
        await updateUser(user.id, user)
        break;
      case 'البرمجة':
        let message = '⚙️ |لقد عملت ك مبرمج'
        if (Ratio < 30) {
          message += ` وتم اختراق..ك وخسرت ${Amount} جنيه`
          api.sendMessage(message, event.threadID, event.messageID)
          Amount = getRandomAmount(1000, 4000)
          user.mony -= Amount
          await updateUser(user.id, user)
        }
        if (Ratio > 30 && Ratio < 70) {
          message += ` وحصلت علي ${Amount} جنيه`
          api.sendMessage(message, event.threadID, event.messageID)
          Amount = getRandomAmount(1000, 2500)
          user.mony += Amount
          await updateUser(user.id, user)
        }
        if (Ratio > 70) {
          message += ` و انشاءت موقع ناجح وربحت ${Amount} جنيه`
          api.sendMessage(message, event.threadID, event.messageID)
          Amount = getRandomAmount(7000, 10000)
          user.mony += Amount
          await updateUser(user.id, user)
        }
        break;
      case 'التدريس':
        let message = '🎓 | لقد عملت ك مدرس '
        if (Ratio < 30) {
          message += `ولكن يستاء منك الطلاب وخسرت ${Amount}جنيه`
          api.sendMessage(message, event.threadID, event.messageID)
          Amount = getRandomAmount(1000, 2000)
          user.mony -= Amount
          await updateUser(user.id, user)
        }
        if (Ratio > 30 && Ratio < 70) {
          message += `وحثلت علي ${Amount} جنيه`
          api.sendMessage(message, event.threadID, event.messageID)
          Amount = getRandomAmount(1000, 2000)
          user.mony += Amount
          await updateUser(user.id, user)
        }
        if (Ratio > 70) {
          message += `واصبحت افضل مدرس وحصلت علي ${Amount} جنيه`
          api.sendMessage(message, event.threadID, event.messageID)
          Amount = getRandomAmount(1000, 4000)
          user.mony -= Amount
          await updateUser(user.id, user)
        }
        break;
      case 'الشرطة':
        let message = '👮🏻‍♂️ | لقد عملت كشرطي '
        if (Ratio < 30) {
          message += `وحاولت الامساك بمجرم ولكن تفشل في الامساك به وتخسر ${Amount} جنيه`
          api.sendMessage(message, event.threadID, event.messageID)
          Amount = getRandomAmount(2000, 3000)
          user.mony -= Amount
          await updateUser(user.id, user)
        }
        if (Ratio > 30 && Ratio < 70) {
          message += `وامسكت بسيارة مخالفة وحصلت علي ${Amount} جنيه`
          api.sendMessage(message, event.threadID, event.messageID)
          Amount = getRandomAmount(2000, 4000)
          user.mony += Amount
          await updateUser(user.id, user)
        }
        if (Ratio > 70) {
          message += `لقد امسكت ب حميدتي وحصلت علي ${Amount} جنيه`
          api.sendMessage(message, event.threadID, event.messageID)
          Amount = getRandomAmount(10000, 40000)
          user.mony += Amount
          await updateUser(user.id, user)
        }
        break;
      case 'الطيران':
        let message = '👨🏻‍✈️ | لقد عملت في مجال الطيران '
        if (Ratio < 30) {
          message += `وسقطت الطائرة ولحسن حظك لم يمت احد وخسرت ${Amount} جنيه`
          api.sendMessage(message, event.threadID, event.messageID)
          Amount = getRandomAmount(5000, 7000)
          user.mony -= Amount
          await updateUser(user.id, user)
        }
        if (Ratio > 30) {
          message += `ونجحت في مهمتك بنجاح وحصلت علي ${Amount} جنيه`
          api.sendMessage(message, event.threadID, event.messageID)
          Amount = getRandomAmount(8000, 10000)
          user.mony += Amount
          await updateUser(user.id, user)
        }
        break;


      default:
        api.sendMessage('🌝 |لم تتمكن من الحصول علي عمل.', event.threadID, event.messageID)

    }
  }
}