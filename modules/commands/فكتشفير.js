module.exports = {
  name: 'فك_التشفير',
  type: '❍ النــصوص ❍',
  description: 'يقوم بفك تشفير النص المدخل',
  execute: (api, event) => {
    const args = event.body.split(' ').slice(1);
    const text = args.join(' ');
    const decryptedText = caesarDecipher(text, 3); // يجب أن يتطابق هذا الرقم مع الرقم المستخدم في التشفير

    api.sendMessage(`${decryptedText}`, event.threadID, event.messageID);
  }
};

function caesarDecipher(text, shift) {
  return text
    .split('')
    .map(char => {
      const code = char.charCodeAt(0);
      if ((code >= 65 && code <= 90) || (code >= 97 && code <= 122)) {
        let newCode = code - shift;
        if ((code >= 97 && newCode < 97) || (code >= 65 && newCode < 65)) {
          newCode += 26;
        }
        return String.fromCharCode(newCode);
      }
      return char;
    })
    .join('');
}