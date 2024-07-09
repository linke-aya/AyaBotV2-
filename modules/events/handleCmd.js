const { getGroupData, saveNewGroup } = require('../global/thread');
const { getUserDate, saveNewUser } = require('../global/users');
const config = require('../../config/config');
const logger = require('../system/logger');
const { hasPermission, permissionLevels } = require('../global/Permissions');

module.exports = async (api, event, commands) => {
  try {
    const ik = `:like:`;
    const user = await getUserDate(event.senderID);
    const group = await getGroupData(event.threadID);

   
  
    
    
    if (!user && group.status || !group && user.isAdmin || group && user.isAdmin || group && group.status || group && !group.status && user.isAdmin) {
      cmd(ik);
    }
    
  } catch (e) {
    logger.error(e);
  }

  async function setReaction(api, reaction, messageID) {
    api.setMessageReaction(reaction, messageID, (err) => {
      if (err) console.error('Filed Set Reaction ', err);
    });
  }

  async function cmd(ik) {
    const args = event.body.slice(config.PREFIX.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = commands.find(cmd => cmd.name === commandName || (cmd.otherName && cmd.otherName.includes(commandName)));
    if (!command) return;

    const userHasPermission = await hasPermission(api, event.senderID, event.threadID, command.hasPermission);
 /**   if (!userHasPermission) {
      setReaction(api, `\uD83C\uDFC1`, event.messageID)
      return api.sendMessage('══════════\nهذا الامر اكبر من استطاعتك\n══════════', event.threadID, event.messageID);
    }
**/
    await setReaction(api, ik, event.messageID);
    await command.execute(api, event, commands);
    return;
  }
};
