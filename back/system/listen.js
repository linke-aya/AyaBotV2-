const log = require('../global/logger');
const cmd = require('../events/cmdEvent')
const auto = require('../events/autoReply')
const join = require('../events/joinEvent')
const leave = require('../events/leaveEvent')
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
            log.info("Message")
            case "message_reply": 
                auto(api, event)
                leave(api, event)
                join(api, event)
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


