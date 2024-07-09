
const config = require('../../config/config')
const { setReachion } = require('../system/message')
module.exports = {
  name: 'اوامر',
  otherName: ['امر', 'command', 'أوامر', 'commands', 'مساعدة', 'مساعده', 'help', 'هلب'],
  version: '3.0.0',
  hasPermission: 0,
  description: 'عرض الأوامر المتاحة أو تفاصيل أمر محدد',
  usage: 'مساعدة > اسم الامر',
  allowedUsers: 'الجميع',
  creator: 'لــنك',
  execute: (api, event, commands) => {
    const args = event.body.split(' ').slice(1);
    const itemsPerPage = 18; // عدد الأوامر في كل صفحة
    const pageNumber = parseInt(args[0], 10) || 1; // رقم الصفحة المطلوبة

    
      const totalCommands = commands.length;
      const totalPages = Math.ceil(totalCommands / itemsPerPage);

      if (pageNumber > totalPages || pageNumber < 1) {
        setReachion(api, `:sad:`, event.messageID)
        api.sendMessage(
`─────────────\n   الصفحة المطلوبة غير موجودة   \n─────────────`, event.threadID, event.messageID);
        return;
      }

      const startIndex = (pageNumber - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const commandsList = commands.slice(startIndex, endIndex).map(command => `${command.name}`).join('\n═══\n');

      const messageText = `
─────────────
   قائمة الأوامر المتاحة   
═════════════

${commandsList}   

═════════════
❍ -عدد الاوامر المتاحة ${totalCommands} 
❍ -صفحة ${pageNumber} من ${totalPages}
═════════════
استخدم ${config.PREFIX}اوامر <رقم الصفحة>
═════════════
      `;
      setReachion(api, `:clapper:`, event.messageID)
      api.sendMessage(messageText, event.threadID, event.messageID);
    }
  
};
