const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: "html",
    version: "1.0.0",
    info: "تنفيذ أكواد HTML وإرسال صورة للنتيجة",
    type: 'اكواد',
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
            return api.sendMessage("⚠️ | يرجى إدخال كود HTML للتنفيذ.", event.threadID, event.messageID);
        }

        const cacheDir = path.join(__dirname, 'cache');
        if (!fs.existsSync(cacheDir)){
            fs.mkdirSync(cacheDir);
        }

        const filePath = path.join(cacheDir, 'result.png'); 

        try {
            // بدء متصفح Puppeteer
            const browser = await puppeteer.launch();
            const page = await browser.newPage();

            // تحميل كود HTML في الصفحة
            await page.setContent(code);

            // التقاط لقطة شاشة
            await page.screenshot({ path: filePath });

            // إغلاق المتصفح
            await browser.close();

            // إرسال لقطة الشاشة للمستخدم
            api.sendMessage({ attachment: fs.createReadStream(filePath) }, event.threadID, event.messageID);
        } catch (error) {
            console.error(error);
            api.sendMessage(`حدث خطأ أثناء تنفيذ كود HTML:\n${error.message}`, event.threadID, event.messageID);
        }
    }
};