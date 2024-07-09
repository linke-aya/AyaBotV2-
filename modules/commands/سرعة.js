const fast = require("fast-speedtest-api");

module.exports = {
    name: 'سرعة',
    type: '❍ الـوسائط ❍',
    version: "1.0.0",
    hasPermssion: 0,
    execute: async function(api, event) {
        try {
            const speedTest = new fast({
                token: "YXNkZmFzZGxmbnNkYWZoYXNkZmhrYWxm",  
                verbose: false,
                timeout: 10000,
                https: true,
                urlCount: 5,
                bufferSize: 8,
                unit: fast.UNITS.Mbps
            });

            const result = await speedTest.getSpeed();
            const responseMessage = 
                `\n` +
                `FAST \n` +
                `\n` +
                `───────────────\n` +
                ` سرعة: ${result} Mbps\n` +
                `───────────────`;

            return api.sendMessage(responseMessage, event.threadID, event.messageID);
        } catch (error) {
            console.error(error); // تسجل الخطأ في وحدة التحكم
            return api.sendMessage("حدث خطأ أثناء اختبار السرعة. يرجى المحاولة مرة أخرى لاحقًا.", event.threadID, event.messageID);
        }
    }
}