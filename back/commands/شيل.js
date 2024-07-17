const { exec } = require('child_process');

module.exports = {
    name: "run",
    version: "1.0.0",
    info: "تنفيذ أكواد معينة",
    type: 'اكواد',
    usageCount: 0,
    creator: 'لنك',
    usages: "[code]",
    run: async (api, event) => {
      const allowedUsers = ["100083602650172"];
      if (!allowedUsers.includes(event.senderID)) {
        return api.sendMessage("ليس لديك الأذونات اللازمة لتنفيذ هذا الأمر.", event.threadID, event.messageID);
      }

      const code = event.body.split(' ').slice(1).join(' ');
      if (!code) {
        return api.sendMessage("⚠️ | يرجى إدخال كود للتنفيذ.", event.threadID, event.messageID);
      }

      exec(code, (error, stdout, stderr) => {
        if (error) {
          api.sendMessage(`\n${error.message}`, event.threadID, event.messageID);
          return;
        }
        if (stderr) {
          api.sendMessage(`${stderr}`, event.threadID, event.messageID);
          return;
        }
        api.sendMessage(`${stdout}`, event.threadID, event.messageID);
      })
    }
}