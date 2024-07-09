module.exports = {
  name: 'آيدي',
  type: '❍ المجمـوعات ❍',
  hasPermission: 0,
  otherName: ['ايدي', 'id', 'userid', 'user-id'],
  version: '1.0.0',
  description: 'استخراج معرف الشخص الذي أرسل الأمر أو معرف الشخص الذي تم الرد عليه',
  usage: 'استخراج معرف',
  allowedUsers: 'الجميع',
  creator: 'لــنك',
  execute: (api, event, commands) => {
    // إذا كان هناك رد على رسالة، استخراج معرف الشخص الذي تم الرد عليه
    if (event.messageReply) {
      const repliedUserId = event.messageReply.senderID;
      api.sendMessage(`${repliedUserId}`, event.threadID, event.messageID);
    } else {
      // استخراج معرف الشخص الذي أرسل الأمر
      const senderId = event.senderID;
      api.sendMessage(`${senderId}`, event.threadID, event.messageID);
    }
  }
};