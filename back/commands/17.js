const { getUser, updateUser } = require('../mongoose/user');

const JOBS = {
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
  },
  'التنظيف': {
    ranges: [
      { max: 50, amountRange: [500, 1000], result: 'وتعرضت لكثير من المتاعب وخسرت' },
      { max: 100, amountRange: [1000, 2000], result: 'وقمت بعملك بنجاح وحصلت على' }
    ],
    message: '🧹 | لقد عملت في مجال التنظيف '
  },
  'الزراعة': {
    ranges: [
      { max: 30, amountRange: [1000, 1500], result: 'وكان الموسم سيئًا وخسرت' },
      { max: 70, amountRange: [1500, 2500], result: 'وكان الموسم جيدًا وحصلت على' },
      { max: 100, amountRange: [2500, 3500], result: 'وكان الموسم ممتازًا وحصلت على' }
    ],
    message: '🌾 | لقد عملت في مجال الزراعة '
  }
};

const getRandomJobResult = (job) => {
  const Ratio = Math.floor(Math.random() * 101);
  const range = job.ranges.find(r => Ratio <= r.max);
  if (!range) return null;
  return {
    amount: getRandomAmount(range.amountRange[0], range.amountRange[1]),
    resultMessage: range.result
  };
};

const getRandomAmount = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const processJob = async (api, event, user) => {
  const currentDate = new Date();
  const lastJobDate = new Date(user.lastJobTime || 0);
  const timeDiff = currentDate - lastJobDate;
  const oneDay = 24 * 60 * 60 * 1000;

  if (timeDiff < oneDay) {
    const hoursRemaining = Math.ceil((oneDay - timeDiff) / (60 * 60 * 1000));
    api.sendMessage(`⚠️ | لا يمكنك العمل الآن. عد بعد ${hoursRemaining} ساعة(s).`, event.threadID, event.messageID);
    return;
  }

  const jobKeys = Object.keys(JOBS);
  const randomJobKey = jobKeys[Math.floor(Math.random() * jobKeys.length)];
  const job = JOBS[randomJobKey];

  user.lastJobTime = currentDate;

  const { amount, resultMessage } = getRandomJobResult(job);
  if (!amount) {
    api.sendMessage('🌝 | لم تتمكن من الحصول على عمل.', event.threadID, event.messageID);
    return;
  }

  const finalMessage = `${job.message} ${resultMessage.replace('المبلغ', amount)} جنيه.`;
  user.mony += (resultMessage.includes('خسرت') ? -amount : amount);
  await updateUser(user.id, user);

  api.sendMessage(finalMessage, event.threadID, event.messageID);
};

const checkSpecialRewards = (user) => {
  const specialRewards = [
    { threshold: 100000, message: '🎉 | تهانينا! لقد وصلت إلى 100,000 جنيه! حصلت على مكافأة قدرها 5000 جنيه.', reward: 5000 },
    { threshold: 500000, message: '🎉 | مذهل! لقد وصلت إلى 500,000 جنيه! حصلت على مكافأة قدرها 20000 جنيه.', reward: 20000 },
    { threshold: 1000000, message: '🎉 | أسطورة! لقد وصلت إلى مليون جنيه! حصلت على مكافأة قدرها 50000 جنيه.', reward: 50000 }
  ];

  const rewards = specialRewards.filter(r => user.mony >= r.threshold && !user.rewards.includes(r.threshold));
  rewards.forEach(async (reward) => {
    user.mony += reward.reward;
    user.rewards.push(reward.threshold);
    await updateUser(user.id, user);
  });

  return rewards.map(r => r.message);
};

module.exports = async (api, event) => {
  const user = await getUser(event.senderID);
  if (!user) {
    api.sendMessage('⚠️ | حدث خطأ في الحصول على بيانات المستخدم.', event.threadID, event.messageID);
    return;
  }

  await processJob(api, event, user);

  const rewardMessages = checkSpecialRewards(user);
  rewardMessages.forEach(message => {
    api.sendMessage(message, event.threadID, event.messageID);
  });
};