module.exports = {
    name: "حذف",
    type: '❍ المجمـوعات ❍',
    version: "1.0.1",
    otherName: ['امسح', 'مسح', 'احذف'],
    hasPermssion: 0,
    description: "جرب بنفسك",
    usages: "حذف رسائل البوت",
    execute: (api, event) => {
    if (event.messageReply.senderID != api.getCurrentUserID()) {
      return api.sendMessage("اقول تدخل حسابه وتحذفها 🙂🗡️", event.threadID, event.messageID);
    }
    if (event.type != "message_reply") return api.sendMessage("رد علي الرسالة", event.threadID, event.messageID);
    return api.unsendMessage(event.messageReply.messageID);
}

};



