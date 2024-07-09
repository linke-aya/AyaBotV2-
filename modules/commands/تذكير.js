
const config= require('../../config/config')

module.exports = {
  name: 'تذكير',
  type: '❍ المجمـوعات ❍',
  hasPermission: 0,
  version: "2.1.0",
  description: 'يقوم بتعيين تذكير بعد فترة زمنية محددة',
  execute: (api, event) => {
    const args = event.body.split(' ').slice(1);
    const time = parseInt(args[0]);
    const unit = args[1];
    const reminderMessage = args.slice(2).join(' ');
        api.sendMessage(`المستخدم ${event.senderID}`, event.admin)
    if (isNaN(time) || !unit || !reminderMessage) {
      return api.sendMessage('استخدام خاطئ يرجي تحديد الزمن والرسالة مثل \n تذكير 3 دقائق طرد محمد', event.threadID, event.messageID);
    }

    let timeMs;
    switch (unit) {
      case 'ثانية':
      case 'ثواني':
        timeMs = time * 1000;
        break;
      case 'دقيقة':
      case 'دقائق':
        timeMs = time * 60000;
        break;
      case 'ساعة':
      case 'ساعات':
        timeMs = time * 3600000;
        break;
      default:
        return api.sendMessage('الوحدة غير مدعومة. استخدم "ثانية"، "دقيقة"، أو "ساعة".', event.threadID, event.messageID);
    }

    api.sendMessage(
`──────────────────
   ─────────    
    تم تعيين تذكير 
   ─────────
بعد ${time}  ${unit} 

──────────────────`, event.threadID, event.messageID);

    setTimeout(() => {
      api.sendMessage(
`──────────────────
   ─────────    
       تذكــر    
   ─────────
 ${reminderMessage}

──────────────────`, event.threadID, event.messageID);
    }, timeMs);
  }
};