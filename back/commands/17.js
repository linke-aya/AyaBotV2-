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
    const getRandomAmount = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    const Ratio = Math.floor(Math.random() * 101);
    
    const user = await getUser(event.senderID);
    if (!user) {
      api.sendMessage('⚠️ | ليس لديك حساب.', event.threadID, event.messageID);
      return;
    }

    const Jobs = {
      'الطب': {
        ranges: [
          { max: 15, amountRange: [1000, 5000], result: 'فشلت في العملية وخسرت' },
          { max: 20, amountRange: [500, 1000], result: 'وكانت خبرتك قليلة لذا حصلت على' },
          { max: 70, amountRange: [1500, 2500], result: 'نجحت في إتمام العملية وحصلت على' },
          { max: 100, amountRange: [4000, 5000], result: 'أنقذت حياة وحصلت على' }
        ],
        message: '🌝 | لقد عملت في مجال الطب '
      },
      'الطبخ': {
        ranges: [
          { max: 50, amountRange: [100, 2000], result: 'طبخت طبخة سيئة وخسرت' },
          { max: 100, amountRange: [4000, 5000], result: 'طبخت طبخة مميزة وحصلت على' }
        ],
        message: '🍞 | لقد عملت في مجال الطبخ '
      },
      'التجارة': {
        ranges: [
          { max: 10, amountRange: [1000, 2000], result: 'العصير وحصلت على' },
          { max: 30, amountRange: [2000, 2500], result: 'الفواكه وحصلت على' },
          { max: 50, amountRange: [2000, 2500], result: 'الحلويات وحصلت على' },
          { max: 70, amountRange: [3000, 4000], result: 'الملابس وحصلت على' },
          { max: 90, amountRange: [4000, 5000], result: 'المخدرات وحصلت على' },
          { max: 100, amountRange: [2000, 3000], result: 'الماكولات وحصلت على' }
        ],
        message: '💲 | لقد عملت في مجال التجارة '
      },
      'الدعارة': {
        ranges: [
          { max: 100, amountRange: [5000, 10000], result: 'نمت ليلة في الفراش وحصلت على' }
        ],
        message: '🌝 | لقد عملت في مجال الدعارة '
      },
      'البرمجة': {
        ranges: [
          { max: 30, amountRange: [1000, 4000], result: 'وتعرضت لاختراق وخسرت' },
          { max: 70, amountRange: [1000, 2500], result: 'وحصلت على' },
          { max: 100, amountRange: [7000, 10000], result: 'وأنشأت موقعًا ناجحًا وربحت' }
        ],
        message: '⚙️ | لقد عملت ك مبرمج '
      },
      'التدريس': {
        ranges: [
          { max: 30, amountRange: [1000, 2000], result: 'ولكن الطلاب لم يعجبهم عملك وخسرت' },
          { max: 70, amountRange: [1000, 2000], result: 'وحصلت على' },
          { max: 100, amountRange: [1000, 4000], result: 'وأصبحت أفضل مدرس وحصلت على' }
        ],
        message: '🎓 | لقد عملت ك مدرس '
      },
      'الشرطة': {
        ranges: [
          { max: 30, amountRange: [2000, 3000], result: 'وحاولت الإمساك بمجرم ولكن فشلت وخسرت' },
          { max: 70, amountRange: [2000, 4000], result: 'وأمسكت بسيارة مخالفة وحصلت على' },
          { max: 100, amountRange: [10000, 40000], result: 'وأمسكت بمجرم كبير وحصلت على' }
        ],
        message: '👮🏻‍♂️ | لقد عملت كشرطي '
      },
      'الطيران': {
        ranges: [
          { max: 30, amountRange: [5000, 7000], result: 'وسقطت الطائرة ولكن لحسن الحظ لم يمت أحد وخسرت' },
          { max: 100, amountRange: [8000, 10000], result: 'ونجحت في مهمتك وحصلت على' }
        ],
        message: '👨🏻‍✈️ | لقد عملت في مجال الطيران '
      }
    };

    const currentDate = new Date();
    const lastJobDate = new Date(user.lastJobTime || 0);
    const timeDiff = currentDate - lastJobDate;
    const oneDay = 24 * 60 * 60 * 1000;

    if (timeDiff < oneDay) {
      const hoursRemaining = Math.ceil((oneDay - timeDiff) / (60 * 60 * 1000));
      api.sendMessage(`⚠️ | لا يمكنك العمل الآن. عد بعد ${hoursRemaining} ساعة(s).`, event.threadID, event.messageID);
      return;
    }

    const Job = Jobs[Math.floor(Math.random() * Object.keys(Jobs).length)];
    user.lastJobTime = currentDate;

    const job = Jobs[Job];
    const jobRange = job.ranges.find(range => Ratio <= range.max);
    const Amount = getRandomAmount(jobRange.amountRange[0], jobRange.amountRange[1]);
    const resultMessage = jobRange.result.replace('المبلغ', Amount);

    user.mony += (resultMessage.includes('خسرت') ? -Amount : Amount);
    await updateUser(user.id, user);

    api.sendMessage(`${job.message} ${resultMessage}`, event.threadID, event.messageID);
  }
};