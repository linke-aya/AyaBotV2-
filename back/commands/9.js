
const { getUser } = require('../mongoose/user');
const log = require('../global/logger');

module.exports = {
    name: "رصيدي",
    type: 'الاموال',
    updatedAt: '2024/7/20',
    otherName: ["رصيدي", "رصيد"],
    usage: 'رصيدي',
    usageCount: 0,
    info: 'عرض رصيدك الحالي',

    run: async (api, event) => {
       
          const userID = event.senderID
        const user = await getUserDate(userID)
            if (!user) {
       api.sendMessage(`⚠️ | ليس لديك حساب قم بإنشاء واحد.`, event.threadID, event.messageID)
        return

        }
 
            api.sendMessage(`لديك ${user.money} جنيه.`, event.threadID, event.messageID);
     
    }
};
