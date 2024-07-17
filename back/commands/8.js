const axios = require("axios");

module.exports = {
    name: "سورة",
    type: 'الدين',
    creator: 'لنك',
    version: "1.0.0",
    usageCount: 0,
    run: async (api, event) => {
        const { threadID, messageID, body } = event;
        const args = body.trim().split(" ");
        const surahName = args.slice(1).join(" ");
        const maxMessageLength = 2000; // الحد الأقصى لعدد الأحرف في رسالة فيسبوك

        if (!surahName) {
            return api.sendMessage("⚠️ |يرجى إرسال اسم السورة.", threadID, messageID);
        }

        try {
            // استدعاء API للحصول على بيانات السورة
            const response = await axios.get(`https://api.alquran.cloud/v1/surah/${encodeURIComponent(surahName)}/ar.asad`);
            const surahData = response.data;

            if (surahData.status !== "OK") {
                return api.sendMessage("لم يتم العثور على السورة. يرجى التحقق من اسم السورة.", threadID, messageID);
            }

            let ayahsText = "";
            for (const ayah of surahData.data.ayahs) {
                ayahsText += `\n${ayah.numberInSurah}. ${ayah.text}`;
            }

            // تقسيم السورة إلى أجزاء إذا كانت أطول من الحد المسموح به
            const messages = [];
            for (let i = 0; i < ayahsText.length; i += maxMessageLength) {
                messages.push(ayahsText.substring(i, i + maxMessageLength));
            }

            for (const message of messages) {
                await api.sendMessage(message, threadID, messageID);
            }
        } catch (error) {
            console.error(error);
            return api.sendMessage("حدث خطأ أثناء جلب بيانات السورة. يرجى المحاولة مرة أخرى.", threadID, messageID);
        }
    }
};