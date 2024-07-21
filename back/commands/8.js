const { getGroup, updateGroup } = require('../mongoose/thread');
const log = require('../global/logger');

module.exports = {
    name: "بادئة",
    type: 'نظام',
    otherName: ['البادئة', 'prefix'],
    creator: 'لنك',
    updatedAt: '2024/7/20',
    info: 'تغيير البادئة',
    version: "1.1.0",
    usageCount: 0,
    run: async (api, event) => {
        const { threadID, messageID, body, type } = event;
        const args = body.trim().split(' ').slice(1);
        const newPrefix = args[0];

        try {
            const group = await getGroup(threadID);
            if (!group) {
                return api.sendMessage("⚠️ | لم يتم العثور على المجموعة.", threadID, messageID);
            }

            if (!newPrefix) {
                group.prefix = ''
                updateGroup(threadID, group)
                api.sendMessage(`⚠️ | تم حذف البادئة.`, threadID, messageID)   
            } else {
                group.prefix = newPrefix.trim();
                await updateGroup(threadID, group);
                return api.sendMessage(`⚠️ | تم تغيير البادئة إلى ${newPrefix.trim()}`, threadID, messageID);
            }
        } catch (error) {
            log.error(error);
            return api.sendMessage("⚠️ | حدث خطأ أثناء معالجة طلبك. حاول مرة أخرى.", threadID, messageID);
        }
    }
};