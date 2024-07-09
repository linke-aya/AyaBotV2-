
const config= require('../../config/config')

module.exports = {
  name: 'الوقت',
  type: '❍ الـوسائط ❍',
  hasPermission: 0,
  otherName: ['تايم', 'الساعة', 'وقت', 'الزمن'],
  description: 'يقوم بإظهار الوقت الحالي',
  execute: (api, event) => {
    const currentTime = new Date().toLocaleTimeString();
    api.sendMessage(`──────────────
     ${currentTime} 
──────────────
`, event.threadID, event.messageID);
   
 }
};