const config = require('../../config/config');
const response = require('../../config/response');

module.exports = async (api, event) => { 
  if (!event) return; 
  
  if (!event.body.startsWith(config.PREFIX)) {
    const responseMessage = response[event.body.toLowerCase()];
    if (responseMessage) {
    
        
        
        api.sendMessage(
          {
            body: `${responseMessage}`,
            
          }, event.threadID, event.messageID)

 
    }
    return;
  }
};

async function setReachion(api, reachion, messageID) {
  api.setMessageReaction(reachion, messageID, (err) => {
    if (err) console.error('Filed Set Reachion ', err)
  })
}
