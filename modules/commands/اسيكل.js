module.exports = {
  name: 'اسكي',
  type: '❍ النــصوص ❍',
  description: 'يقوم بتحويل النص إلى رموز ASCII',
hasPermission: 0,
  execute: async (api, event) => {
    const args = event.body.split(' ').slice(1);
    const text = args.join(' ');
    const asciiText = convertToASCII(text);
      
    api.sendMessage(`${asciiText}`, event.threadID, event.messageID);
  },
};

function convertToASCII(text) {
  let asciiText = '';
  for (let i = 0; i < text.length; i++) {
    asciiText += text.charCodeAt(i) + ' ';
  }
  return asciiText.trim();
}