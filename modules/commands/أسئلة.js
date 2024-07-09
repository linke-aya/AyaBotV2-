const config = require('../../config/config');
const logger = require('../system/logger');
const permissions = require('../global/Permissions');

module.exports = {
  name: "صلاحية",
  type: '❍ المـطـور ❍',
  version: '1.0.0',
  description: 'تغيير صلاحيات أمر معين',
  allowedUsers: 'المطور',
  hasPermission: 2,
  usage: 'صلاحية <اسم الأمر> <الصلاحية الجديدة>',
  execute: async (api, event, commands) => {
    try {
      // التحقق من أن الرسالة تحتوي على اسم الأمر والصلاحية الجديدة
      const args = event.body.slice(config.PREFIX.length).trim().split(/ +/);
      if (args.length < 2) {
        return api.sendMessage(`يرجى تقديم اسم الأمر والصلاحية الجديدة. مثال: ${config.PREFIX}صلاحية اقتباس 1`, message.threadID);
      }

      const commandName = args[1].toLowerCase();
      const newPermissionLevel = parseInt(args[2]);

      // التحقق من وجود الأمر
      const command = commands.find(cmd => cmd.name.toLowerCase() === commandName || (cmd.otherName && cmd.otherName.includes(commandName)));
      if (!command) {
        return api.sendMessage(`لا يوجد أمر باسم "${commandName}"`, event.threadID);
      }

      // التحقق من أن مستوى الصلاحية الجديد صالح
      if (isNaN(newPermissionLevel) || newPermissionLevel < 0 || newPermissionLevel > 2) {
        return api.sendMessage(`الرجاء تحديد مستوى صلاحية صالح بين 0 و 2`, message.threadID, message.messageID);
      }

      // تحديث صلاحية الأمر
      command.hasPermission = newPermissionLevel;
      return api.sendMessage(`تم تغيير صلاحية الأمر "${commandName}" إلى ${newPermissionLevel}`, event.threadID, event.messageID);
    } catch (error) {
      logger.error('Failed to change command permission', error);
      return api.sendMessage(`حدث خطأ أثناء تغيير صلاحية الأمر`,  event.threadID)
    }
  }
};
