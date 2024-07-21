const log = require('../global/logger');

module.exports = async (api, event) => {
  if (event.logMessageType == "log:unsubscribe") {
    const leftUserID = event.logMessageData.leftParticipantFbId;

    
    try {
      await api.getUserInfo(leftUserID, async (err, info) => {
        if (err) {
          logger.error(err)
          return
        }
        const threadID = event.threadID;
        await api.sendMessage(`⚠️ | خرج ${info.name} هل ترغب في اعادته. ؟\nتفاعل بي 👍 للتأكيد.`, threadID, event.messageID)

      })
    } catch (error) {
      logger.error(`Failed to add user with ID ${leftUserID} to the group ${threadID}:` + error);
    }

  }
};