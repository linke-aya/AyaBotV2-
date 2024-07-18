const { getGroup, updateGroup } = require('../mongoose/thread');
const log = require('../global/logger');

module.exports = {
    name: "بادئة",
    type: 'نظام',
    otherName: ['البادئة', 'prefix'],
    creator: 'لنك',
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
                return api.sendMessage("⚠️ | رد على هذه الرسالة بالبادئة الجديدة.", threadID, (err, info) => {
                    if (err) {
                        log.error(err);
                        return api.sendMessage("⚠️ | حدث خطأ أثناء إرسال الرسالة. حاول مرة أخرى.", threadID, messageID);
                    }
                    
                    log.warn(info);

                    // الاستماع للرسالة المستجيبة لتحديد البادئة الجديدة
                    api.listen((err, response) => {
                        if (err) {
                            log.error(err);
                            return;
                        }

                        if (response.type === "message_reply" && response.messageReply.messageID === info.messageID) {
                            group.prefix = response.body.trim();
                            updateGroup(threadID, group)
                                .then(() => api.sendMessage(`✔️ | تم تغيير البادئة إلى ${response.body.trim()}`, threadID))
                                .catch(updateErr => {
                                    log.error(updateErr);
                                    api.sendMessage("⚠️ | حدث خطأ أثناء تحديث البادئة. حاول مرة أخرى.", threadID, messageID);
                                });
                        }
                    });
                });
            } else {
                group.prefix = newPrefix.trim();
                await updateGroup(threadID, group);
                return api.sendMessage(`✔️ | تم تغيير البادئة إلى ${newPrefix.trim()}`, threadID, messageID);
            }
        } catch (error) {
            log.error(error);
            return api.sendMessage("⚠️ | حدث خطأ أثناء معالجة طلبك. حاول مرة أخرى.", threadID, messageID);
        }
    }
};