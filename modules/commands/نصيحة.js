const axios = require('axios');

module.exports = {
    name: 'آية',
    type: '❍ اسـلامية ❍',
    otherName: ["قران"],
    version: '1.0.0',
    hasPermssion: 0,
    description: 'جلب اية من القرآن الكريم ',
    execute: async (api, event) => {
        try {
            const response = await axios.get('https://api.alquran.cloud/v1/ayah/random');

            const { text, surah, numberInSurah } = response.data.data;

            const messageToSend = `${text}\n\n${surah.name}،  ${numberInSurah}`;

            api.sendMessage(messageToSend, event.threadID, event.messageID);
        } catch (error) {
            console.error('Error fetching Quran quote:', error);
            api.sendMessage('حدث خطأ أثناء جلب الاقتباس من القرآن الكريم.', event.threadID);
        }
    }
};