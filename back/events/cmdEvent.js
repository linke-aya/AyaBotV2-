const { getGroup, saveGroup } = require('../mongoose/thread');
const { getUser, saveUser } = require('../mongoose/user');
const log = require('../global/logger');

module.exports = async (api, event, commands) => {
  if (!event) return;
  if (!event.body) return;

  try {
    const user = await getUser(event.senderID);
    let group = await getGroup(event.threadID);

    if (!user) {
      const userInfo = await new Promise((resolve, reject) => {
        api.getUserInfo(event.senderID, (err, info) => {
          if (err) {
            log.error(err);
            return reject(err);
          }
          resolve(info[event.senderID]);
        });
      });
      await saveUser({
        userName: userInfo.name,
        img: userInfo.profileUrl,
        id: event.senderID
      });
    }

    if (!group) {
      const threadInfo = await new Promise((resolve, reject) => {
        api.getThreadInfo(event.threadID, (err, info) => {
          if (err) {
            log.error(err);
            return reject(err);
          }
          resolve(info);
        });
      });
      group = {
        name: threadInfo.name,
        img: threadInfo.imageSrc,
        id: event.threadID,
        messageCount: threadInfo.messageCount,
        members: threadInfo.participantIDs.map(member => member.id),
        admins: threadInfo.adminIDs.map(admin => admin.id),
        status: true // Assume a default status for the group if it's not already defined
      };
      await saveGroup(group);
    }

    if (!user.isAdmin && !group.status) {
      api.setMessageReaction('😠', event.messageID);
    }

    if (group.status || user.isAdmin) {
      await handleCmd(group);
    }

  } catch (e) {
    log.error(e);
  }

  async function handleCmd(group) {
    const args = event.body.slice(group.prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = commands.find(cmd => cmd.name === commandName || (cmd.otherName && cmd.otherName.includes(commandName)));
    if (!command) return;
    await command.run(api, event, commands);
    return;
  }
};