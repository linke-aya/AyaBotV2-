const log = require('../global/logger')
const { getGroup, saveGroup, updateGroup } = require('../mongoose/thread');
const { getUser, saveUser, updateUser } = require('../mongoose/user');
const { getReply } = require('../mongoose/reply')
module.exports = async (api, event) => {
  const { threadID, messageID, senderID, body, type } = event
  if (!body) return
  const { sendMessage, getUserInfo, getThreadInfo } = api
  const user = await getUser(senderID)
  const group = await getGroup(threadID)
  if (!user) {
    try {
      const userInfo = await new Promise((resolve, reject) => {
        getUserInfo(senderID, (err, info) => {
          if (err) {
            log.error(err);
            return reject(err);
          }
          resolve(info[senderID]);
        });
      });
      await saveUser({
        userName: userInfo.name,
        img: userInfo.profileUrl,
        id: event.senderID
      });
    } catch (e) {
      throw e
    }
  }
  if (!group) {
    const threadInfo = await new Promise((resolve, reject) => {
        api.getThreadInfo(threadID, (err, info) => {
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
        id: threadID,
        messageCount: threadInfo.messageCount,
        members: threadInfo.participantIDs,
        admins: threadInfo.adminIDs,
        status: false
      };
      await saveGroup(group);
  }  
  
  const reply = await getReply(body)
  if (!reply) return
  if (reply) {
  sendMessage(reply.Answer, threadID, messageID)
  }
  
  if (user && user.isAdmin) {
    if (body === 'اية') {
      sendMessage(`مرحبا بك ي مطور ${user.name}`, threadID, messageID)
    }
    if (body === `'-'`) {
      sendMessage(user.name, threadID, messageID)
    }
    if (body === `✅` || body === `✔️`) {
      group.status = true
      await updateGroup(threadID, group)
      sendMessage(`تمت الموافقة علي المجموعة\nكتابة ${group.prefix}اوامر تساعد علي روية\nالاوامر المتاحة`, threadID, messageID)
    }
  }
  
  
  
}