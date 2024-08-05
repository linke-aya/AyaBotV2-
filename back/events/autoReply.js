const log = require('../global/logger');
const { getGroup, saveGroup, updateGroup } = require('../mongoose/thread');
const { getUser, saveUser } = require('../mongoose/user');
const { getReply } = require('../mongoose/reply');

async function fetchUserInfo(api, senderID) {
  return new Promise((resolve, reject) => {
    api.getUserInfo(senderID, (err, info) => {
      if (err) {
        log.error(err);
        return reject(err);
      }
      resolve(info[senderID]);
    });
  });
}

async function fetchThreadInfo(api, threadID) {
  return new Promise((resolve, reject) => {
    api.getThreadInfo(threadID, (err, info) => {
      if (err) {
        log.error(err);
        return reject(err);
      }
      resolve(info);
    });
  });
}

module.exports = async (api, event) => {
  const { threadID, messageID, senderID, body } = event;
  if (!body) return;

  const { sendMessage } = api;

  let user = await getUser(senderID);
  if (!user) {
    try {
      const userInfo = await fetchUserInfo(api, senderID);
      await saveUser({
        userName: userInfo.name,
        img: userInfo.profileUrl,
        id: senderID
      });
      user = await getUser(senderID); // Refresh user data after saving
    } catch (e) {
      log.error(`Failed to fetch or save user: ${e}`);
      return;
    }
  }

  let group = await getGroup(threadID);
  if (!group) {
    try {
      const threadInfo = await fetchThreadInfo(api, threadID);
      group = {
        name: threadInfo.name,
        img: threadInfo.imageSrc,
        id: threadID,
        messageCount: threadInfo.messageCount,
        members: threadInfo.participantIDs,
        admins: threadInfo.adminIDs,
        prefix: '.',
        status: false
      };
      await saveGroup(group);
    } catch (e) {
      log.error(`Failed to fetch or save group: ${e}`);
      return;
    }
  }

  const reply = await getReply(body);
  if (reply) {
    sendMessage(reply.Answer, threadID, messageID);
  }

  if (user && user.isAdmin) {
    switch (body) {
      case 'اية':
        sendMessage(`مرحبا بك ي مطور ${user.name}`, threadID, messageID);
        break;
      case `'-'`:
        sendMessage(user.name, threadID, messageID);
        break;
      case `✅`:
      case `✔️`:
        group.status = true;
        await updateGroup(threadID, group);
        sendMessage(`تمت الموافقة علي المجموعة\nكتابة ${group.prefix}اوامر تساعد علي روية\nالاوامر المتاحة`, threadID, messageID);
        break;
    }
  }
};