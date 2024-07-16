const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'qr',
  type: 'الصور',
  otherName: ['كود', 'كود_استجابة', 'qr'],
  version: '1.0.0',
  info: 'تحويل نص إلى QR كود',
  usage: '<النص>',
  creator: 'لــنك',
  run: async (api, event) => {
    const text = event.body.split(' ').slice(1).join(' ');
    if (!text) {
      return api.sendMessage('يرجى إدخال نص لتحويله إلى QR كود.', event.threadID, event.messageID);
    }

    // تأكد من وجود مجلد "cache"
    const cacheDir = path.join(__dirname, 'cache');
    if (!fs.existsSync(cacheDir)){
      fs.mkdirSync(cacheDir);
    }

    const filePath = path.join(cacheDir, 'qr.png'); 

    try {
      await QRCode.toFile(filePath, text);
      api.sendMessage({ attachment: fs.createReadStream(filePath) }, event.threadID, event.messageID);
    } catch (error) {
      console.error(error);
      api.sendMessage('حدث خطأ أثناء إنشاء QR كود.', event.threadID, event.messageID);
    }
  }
};