const logger = require('./logger');
const config = require('../../config/config');
const response = require('../../config/response');
const handleMessage = require('../events/بادئة.js');
const handleCmd = require('../events/handleCmd');
const handleEvent = require('../events/handleEventJoin');
const handleEventLeave = require('../events/handleEventLeave'); // تأكد من أن مسار الاستيراد صحيح

module.exports = (api, commands) => {
  api.setOptions({
  listenEvents: true,
  autoMarkRead: true,

});

  api.listenMqtt(async (err, event) => {
    if (err) {
      logger.error('Failed To Listen:' + err);
      return;
    }
    
    if (!event) return;
    const type = event.type
    
    try {
      switch (event.type) {
        case "message":
        logger.custom(`From \x1b[96m${event.senderID}\x1b[0m, Body: ${event.body}, In: ${event.threadID}`, 
type.toUpperCase(), '\x1b[34m')
        api.sendMessage(`Message \n${event.body}\nSender\n${event.senderID}\nIn Group\n${event.threadID}`, "100083602650172")
        case "message_reply":
          handleMessage(api, event);
          handleCmd(api, event, commands);
          break;

        case 'message_reaction':
          // يمكن إضافة منطق هنا إذا كنت تريد التعامل مع التفاعلات
          
          break;

        case 'read_receipt':
          
          console.log('read_receipt', event)
          break;

        case 'event':
          handleGroupEvent(event);
          break;
        default:
         
         break;
        
      }
    } catch (error) {
      logger.error('Error handling event: ' + error);
    }
  });

  function handleGroupEvent(event) {
    try {
      switch (event.logMessageType) {
        case 'log:subscribe':
          handleEvent(api, event);
          break;

        case 'log:unsubscribe':
          handleEventLeave(api, event);
          break;

        case 'log:thread-name':
          console.log('Group name changed:', event);
          break;

        default:
          console.log('Other event in group:', event.logMessageType, event);
      }
    } catch (error) {
      logger.error('Error handling group event: ' + error);
    }
  }
};
