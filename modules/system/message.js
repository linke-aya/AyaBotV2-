

async function setReachion(api, reachion, messageID) {
  api.setMessageReaction(reachion, messageID, (err) => {
    if (err) console.error('Filed Set Reachion ', err)
  })
}
async function sendMessage(api, message, threadID) {
  api.sendMessage(message, threadID)
}

async function reply(api, threadID, messageID, message) {
  api.sendMessage(message, threadID, messageID)
}

module.exports = {
 setReachion,
  sendMessage,
  reply
}