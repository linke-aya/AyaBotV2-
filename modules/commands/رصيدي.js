const config = require('../../config/config');
const { getUserDate } = require('../global/users');
const logger = require('../system/logger');

module.exports = {
    name: "رصيدي",
    type: '❍ الـاموال ❍',
    otherName: ["رصيدي", "رصيد"],
    usage: 'رصيدي',
    hasPermission: 0,
    description: 'عرض رصيدك الحالي',

    execute: async (api, event) => {
       
          const userID = event.senderID
        const user = await getUserDate(userID)
            if (!user) {
       api.sendMessage(`────────────
        قم بانشاء حساب اولا
────────────`, event.threadID, event.messageID)
        return

        }
        if (user.money <= 100) {
          setReachion(api, ':haha:', event.messageID)
          api.sendMessage('───────────────\n  مافي داعي للفضائح \n  استخدم امر هدية \n───────────────', event.threadID, event.messageID)
          return 
        }
            setReachion(api, ':like:', event.messageID)
            api.sendMessage(`───────────────────────
            ───────────
- رصيدك الحالي هو ${user.money}  
            ───────────
────────────────────────`, event.threadID, event.messageID);
     
    }
};
async function setReachion(api, reachion, messageID) {
  await api.setMessageReaction(reachion, messageID, (err) => {
    if (err) console.error('Filed Set Reachion ', err)
  })
}