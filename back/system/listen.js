const log = require('../global/logger');
const cmd = require('../events/cmdEvent')
let sentMessageID = null; // متغير لتخزين معرف الرسالة المرسلة

module.exports = function listen(api, commands) {
  api.setOptions({
    listenEvents: true,
    autoMarkRead: true,
    selfListen: true
  });

  api.listenMqtt(async (err, event) => {
    if (err) return log.error(err);
    if (!event) return;

    // معالجة الأحداث بناءً على نوعها
    switch (event.type) {
            case "message":
            case "message_reply":  
                cmd(api, event, commands)    
                break;

            case "message_reaction": 
                break;

            case "message_unsend":        
                break;

            case "event":
            case "change_thread_image":           
                break;

            case "typ":
                break;

            case "presence":
                break;

            case "read_receipt":
                break;

            default:
                break;
        }
    });

  };


