module.exports = {
   name: 'كنية',
   type: '❍ المجمـوعات ❍',
   description: 'يقوم بتغيير الكنية',
   hasPermission: 0,
   execute: async (api, event) => {
    const args = event.body.split(' ');
    const action= args[1]
    if (!action || action === undefined || action === '') {
      api.sendMessage(
`─────────
  استخدم خاطي 
 يرجى ادخال كنية
 ─────────`, event.threadID, event.messageID)
      return
    }
      if (!event.messageReply) {
      const userSelf = event.senderID
      await api.changeNickname(action, event.threadID, userSelf, (err) => {
        console.log(err)
      })
      return
      }
      const user = event.messageReply.senderID
      await api.changeNickname(action, event.threadID, user, (err) => {
        console.log(err)
      })
      return
      }
    

 }

