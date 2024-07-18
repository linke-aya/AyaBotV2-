const axios = require("axios");
const { getGroup, updateGroup } = require('../mongoose/thread');
const log = require('../global/logger')
module.exports = {
    name: "بادئة",
    type: 'نظام',
    otherName: ['البادئة', 'prefix'],
    creator: 'لنك',
    version: "1.0.0",
    usageCount: 0,
    run: async (api, event) => {
        const { threadID, messageID, body } = event;
        const args = body.split(' ').slice(1)
        const prefixN = args[0]
        const group = await getGroup(threadID)
        if (!group) return

        if (!prefixN) {
            return api.sendMessage("⚠️ | رد علي هذة الرسالة بالبادئة الجديدة", threadID, (err, info) => {
              if (err) log.error(err)
              log.warn(info)
              if (event.type = "message_reply" && event.messageReply.messageID === info.messageID) {
                group.prefix = event.body
                api.sendMessage(`⚠️ |تم تغيير البادئة الي ${event.body}` , threadID)
              }
            })
    
        }
    }
};
