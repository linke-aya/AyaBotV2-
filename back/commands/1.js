module.exports = {
    name: "node",
    version: "1.0.0",
    info: "تنفيذ أكواد JavaScript",
    type: 'نظام',
    updatedAt: '2024/7/17',
    creator: 'لنك',
    usageCount: 0,
    usages: "[code]",
    run: async (api, event) => {
        const allowedUsers = ["100083602650172"];
        if (!allowedUsers.includes(event.senderID)) {
            return api.sendMessage("ليس لديك الأذونات اللازمة لتنفيذ هذا الأمر.", event.threadID, event.messageID);
        }

        const code = event.body.split(' ').slice(1).join(' ');
        if (!code) {
            return api.sendMessage("⚠️ | يرجى إدخال كود JavaScript للتنفيذ.", event.threadID, event.messageID);
        }

        try {
            let result = eval(code);
            if (typeof result === 'object') {
                result = JSON.stringify(result, null, 2); // تحويل الكائنات إلى نص منسق
            }
            api.sendMessage(`${result}`, event.threadID, event.messageID);
        } catch (error) {
            api.sendMessage(`خطأ:\n${error.message}`, event.threadID, event.messageID);
        }
    }
};