const { getGroup } = require('../mongoose/thread');

module.exports = {
  name: 'هلب',
  type: 'نظام',
  otherName: ['امر', 'help', 'أوامر', 'مساعدة'],
  version: '4.0.0',
  info: 'عرض الأوامر المتاحة أو تفاصيل أمر محدد',
  usageCount: 0,
  usage: '',
  creator: 'لنك',
  run: async (api, event, commands) => {
    const thread = event.threadID;
    const group = await getGroup(thread);
    if (!group) return;

    switch (group.helpList) {
      case 1:
        const args = event.body.split(' ').slice(1);
        const itemsPerPage = 10;
        const pageNumber = parseInt(args[0], 10) || 1;
        const totalCommands = commands.length;
        const totalPages = Math.ceil(totalCommands / itemsPerPage);

        if (pageNumber > totalPages || pageNumber < 1) {
          api.sendMessage(
            `─────────────\n   الصفحة المطلوبة غير موجودة   \n─────────────`, event.threadID, event.messageID);
          return;
        }

        const startIndex = (pageNumber - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const commandsList = commands.slice(startIndex, endIndex).map(command => `『 ${command.name} 』`).join('\t\t\n\n');

        const messageText = `
＿＿＿＿＿＿＿＿＿＿
 الأوامر المتاحة
＊＊＊＊＊＊＊＊＊＊

${commandsList}   

＿＿＿＿＿＿＿＿＿＿
＿＿＿＿＿＿＿＿＿＿
＃　عدد الاوامر المتاحة ${totalCommands} 
＃　صفحة ${pageNumber} من ${totalPages}

استخدم ${group.prefix}اوامر <رقم الصفحة>
＿＿＿＿＿＿＿＿＿＿
        `;
        api.sendMessage(messageText, event.threadID, event.messageID);
        break;

      case 2:
        const commandsByType = commands.reduce((acc, command) => {
          const type = `『 command.type 』` || '『 تحت الاختبار 』';
          if (!acc[type]) acc[type] = [];
          acc[type].push(command);
          return acc;
        }, {});

        let messageText2 = '';
        Object.keys(commandsByType).forEach(type => {
          const commandsList = commandsByType[type].map(command => `〃 ${command.name} 〃`).join('     ');
          messageText2 += `\n${type}\n${commandsList}\n`;
        });

        messageText2 += `\n──────────────────\n❍ -عدد الاوامر المتاحة ${commands.length} \n──────────────────`;

        api.sendMessage(messageText2, event.threadID, event.messageID);
        break;

      case 3:
        const allCommandsList = commands.map(command => `${command.name}`).join('\n');
        const messageText3 = `
──────────────────
    قائمة الأوامر المتاحة   
══════════════════
${allCommandsList}   

──────────────────
❍ -عدد الاوامر المتاحة ${commands.length} 
──────────────────
        `;

        api.sendMessage(messageText3, event.threadID, event.messageID);
        break;

      case 4:
        const commandsWithDescriptions = commands.map(command => `『 ${command.name} 』: ${command.info || 'لا توجد تفاصيل'}`).join('\n\n');
        const messageText4 = `
◀───────────────▶
  الأوامر المتاحة مع الأوصاف
═══════════════════
${commandsWithDescriptions}   

◀───────────────▶
❍ -عدد الأوامر المتاحة ${commands.length} 
◀───────────────▶
        `;

        api.sendMessage(messageText4, event.threadID, event.messageID);
        break;

      case 5:
        const detailedCommandsList = commands.map(command => `『 ${command.name} 』: ${command.info || 'لا توجد تفاصيل'}`).join('\n\n');
        const messageText5 = `
───────────────
الأوامر المتاحة مع تفاصيل
═══════════════
${detailedCommandsList}   

───────────────
❍ -عدد الأوامر المتاحة ${commands.length} 
───────────────
        `;

        api.sendMessage(messageText5, event.threadID, event.messageID);
        break;

      case 6:
        const searchKeyword = event.body.split(' ').slice(1).join(' ');
        if (!searchKeyword) {
          api.sendMessage('⚠️ | يرجي إدخال الكلمة المراد البحث عنها.', event.threadID, event.messageID);
          return;
        }
        const filteredCommands = commands.filter(command => command.name.includes(searchKeyword));
        if (filteredCommands.length === 0) {
          api.sendMessage('لم يتم العثور على أوامر تحتوي على الكلمة المدخلة.', event.threadID, event.messageID);
          return;
        }
        const filteredCommandsList = filteredCommands.map(command => `『 ${command.name} 』`).join('\n');
        const messageText6 = `
───────────────
الأوامر التي تحتوي على '${searchKeyword}'
═══════════════
${filteredCommandsList}   

───────────────
❍ -عدد الأوامر المتاحة ${filteredCommands.length} 
───────────────
        `;

        api.sendMessage(messageText6, event.threadID, event.messageID);
        break;

      case 7:
        const creatorName = event.body.split(' ').slice(1).join(' ');
        if (!creatorName) {
          api.sendMessage('⚠️ | يرجى إدخال اسم المنشئ.', event.threadID, event.messageID);
          return;
        }
        const commandsByCreator = commands.filter(command => command.creator === creatorName);
        if (commandsByCreator.length === 0) {
          api.sendMessage('لم يتم العثور على أوامر تم إنشاؤها بواسطة هذا المنشئ.', event.threadID, event.messageID);
          return;
        }
        const commandsListByCreator = commandsByCreator.map(command => `『 ${command.name} 』`).join('\n');
        const messageText7 = `
───────────────
الأوامر التي أنشأها '${creatorName}'
═══════════════
${commandsListByCreator}   

───────────────
❍ -عدد الأوامر المتاحة ${commandsByCreator.length} 
───────────────
        `;

        api.sendMessage(messageText7, event.threadID, event.messageID);
        break;

      case 8:
        const mostUsedCommands = commands.sort((a, b) => b.usageCount - a.usageCount).slice(0, 10);
        const mostUsedCommandsList = mostUsedCommands.map(command => `『 ${command.name} 』: ${command.usageCount} استخدامات`).join('\n');
        const messageText8 = `
───────────────
الأوامر الأكثر استخدامًا
═══════════════
${mostUsedCommandsList}   

───────────────
❍ -عدد الأوامر المتاحة ${mostUsedCommands.length} 
───────────────
        `;

        api.sendMessage(messageText8, event.threadID, event.messageID);
        break;

      case 9:
        const recentlyUpdatedCommands = commands.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 10);
        const recentlyUpdatedCommandsList = recentlyUpdatedCommands.map(command => `『 ${command.name} 』: آخر تحديث في ${new Date(command.updatedAt).toLocaleDateString()}`).join('\n');
        const messageText9 = `
───────────────
الأوامر التي تم تحديثها مؤخرًا
═══════════════
${recentlyUpdatedCommandsList}   

───────────────
❍ -عدد الأوامر المتاحة ${recentlyUpdatedCommands.length} 
───────────────
        `;

        api.sendMessage(messageText9, event.threadID, event.messageID);
        break;

      case 10:
        const startLetter = event.body.split(' ').slice(1)[0];
        if (!startLetter) {
          api.sendMessage('⚠️ | يرجى إدخال الحرف المراد البحث به.', event.threadID, event.messageID);
          return;
        }
        const commandsStartingWithLetter = commands.filter(command => command.name.startsWith(startLetter));
        if (commandsStartingWithLetter.length === 0) {
          api.sendMessage('⚠️ | لم يتم العثور على أوامر تبدأ بهذا الحرف.', event.threadID, event.messageID);
          return;
        }
        const commandsListStartingWithLetter = commandsStartingWithLetter.map(command => `『 ${command.name} 』`).join('\n');
        const messageText10 = `
───────────────
الأوامر التي تبدأ بالحرف '${startLetter}'
═══════════════
${commandsListStartingWithLetter}   

───────────────
❍ -عدد الأوامر المتاحة ${commandsStartingWithLetter.length} 
───────────────
        `;

        api.sendMessage(messageText10, event.threadID, event.messageID);
        break;

    }
  }
}