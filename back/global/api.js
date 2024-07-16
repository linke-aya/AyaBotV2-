const log = require('../global/logger');
const fs = require('fs');
const path = require('path');

// دالة موحدة لمعالجة الأخطاء
function handleError(action, threadID, error) {
  log.error(`Failed to ${action} in thread ${threadID}: ${error}`);
}

// دالة لإرسال الرسائل
async function send(api, message, threadID) {
  try {
    await api.sendMessage(message, threadID)
  } catch (error) {
    handleError('send message', threadID, error);
  }
}

// دالة للرد على الرسائل
async function reply(api, message, threadID, messageID) {
  try {
    await api.sendMessage(message, threadID, messageID);
    log.info(`Reply sent to message ${messageID} in thread ${threadID}: ${message}`);
  } catch (error) {
    handleError('reply to message', threadID, error);
  }
}

// دالة لإزالة المستخدمين من المجموعة
async function kick(api, userID, threadID) {
  try {
    await new Promise((resolve, reject) => {
      api.removeUserFromGroup(userID, threadID, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
    log.info(`User ${userID} removed from thread ${threadID}`);
  } catch (error) {
    handleError('remove user', threadID, error);
  }
}

// دالة لإضافة المستخدمين إلى المجموعة
async function adduser(api, userID, threadID) {
  try {
    await new Promise((resolve, reject) => {
      api.addUserToGroup(userID, threadID, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
    log.info(`User ${userID} added to thread ${threadID}`);
  } catch (error) {
    handleError('add user', threadID, error);
  }
}

module.exports = {
  send,
  reply,
  kick,
  adduser
};
