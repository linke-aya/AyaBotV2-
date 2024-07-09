const logger = require('../system/logger'); // تأكد من أن مسار logger صحيح
const config = require('../../config/config')
module.exports = async (api, event) => {
if (event.logMessageType == "log:unsubscribe") {
  const leftUserID = event.logMessageData.leftParticipantFbId;
  logger.custom('LEAVE', `${leftUserID} Leave The Group ${event.threadID}`)
  const threadID = event.threadID;
if (config.auto_add) {
  try {
    // إعادة العضو إلى المجموعة
    await api.addUserToGroup(leftUserID, threadID, (err)=> {
       if (err) logger.error(err)

  });
    console.log(`يحاول هذا الءب ${leftUserID} \n الخروج من المجموعة \n تمت اعادته بنجاح`);
    await api.getUserInfo(leftUserID, (err, info) => {
      if (err) {
        logger.error(err) 
        return 
      }
       api.sendMessage(`──────────\nيحاول ${info.name} الخروج من المجموعة\nلذا تمت اعادته الي المجموعة\n──────────`, threadID, event.messageID)

    })
  } catch (error) {
    logger.error(`Failed to add user with ID ${leftUserID} to the group ${threadID}:` + error);
  }
}
}
};
