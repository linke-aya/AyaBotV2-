module.exports = {
    name: "node",
    version: "1.0.0",
    description: "تنفيذ أكواد JavaScript معينة",
    type: 'نظام',
    usages: "[code]",
    run: async (api, event) => {
        const allowedUsers = ["100083602650172"];
        if (!allowedUsers.includes(event.senderID)) {
            return api.sendMessage("ليس لديك الأذونات اللازمة لتنفيذ هذا الأمر.", event.threadID, event.messageID);
        }

        const code = event.body.split(' ').slice(1).join(' ');
        if (!code) {
            return api.sendMessage("يرجى إدخال كود JavaScript للتنفيذ.", event.threadID, event.messageID);
        }

        try {
            const result = eval(code);
            api.sendMessage(`${result}`, event.threadID, event.messageID);
        } catch (error) {
            api.sendMessage(`خطأ:\n${error.message}`, event.threadID, event.messageID);
        }
    }
};