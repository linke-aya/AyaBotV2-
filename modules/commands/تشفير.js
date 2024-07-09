module.exports = {
  name: 'تشفير',
  type: '❍ النــصوص ❍',
  description: 'يقوم بتشفير النص المدخل',
  hasPermission: 0,
  execute: (api, event) => {
    const args = event.body.split(' ').slice(1);
    const text = args.join(' ');
    const encryptedText = caesarCipher(text, 3); // يمكن استبدال الرقم 3 بأي عدد لتغيير التشفير

    api.sendMessage(`${encryptedText}`, event.threadID, event.messageID);
  }
};

function caesarCipher(text, shift) {
  return text
    .split('')
    .map(char => {
      const code = char.charCodeAt(0);
      if ((code >= 65 && code <= 90) || (code >= 97 && code <= 122)) {
        let newCode = code + shift;
        if ((code <= 90 && newCode > 90) || (code <= 122 && newCode > 122)) {
          newCode -= 26;
        }
        return String.fromCharCode(newCode);
      }
      return char;
    })
    .join('');
}