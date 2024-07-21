module.exports = {
  name: 'ايدي',
  updatedAt: '2024/7/20',
  type: 'الادوات',
  usageCount: 0,
  otherName: ['ايدي', 'id', 'userid', 'معرف'],
  version: '1.0.0',
  info: 'استخراج الايدي',
  usage: 'استخراج معرف',
  creator: 'لنك',
  run: (api, event) => {
   
    if (event.messageReply) {
      const repliedUserId = event.messageReply.senderID;
      api.sendMessage(`${repliedUserId}`, event.threadID, event.messageID);
    } else {
      
      const senderId = event.senderID;
      api.sendMessage(senderId, event.threadID, event.messageID);
    }
  }
};