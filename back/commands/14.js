const log = require('../global/logger')
const { makeBank, findBank, updateBank, deleteBank, getBanks } = require('../mongoose/bank')
const { getUser, updateUser } = require('../mongoose/user');



module.exports = {
  name: 'بنك',
  updatedAt: '2024/7/20',
  usegeCount: 0,
  version: '1.0.0',
  info: 'قم بانشاء البنك الخاص بك او العمل',
  run: async (api, event) => {
    const { senderID, threadID, messageID, type } = event
    bankMony = 100000000
    const user = await getUser(senderID)
    if (!user) return
    const args = event.body.split(' ').slice(1);
    const action = args[0]

    if (!action) {
      api.sendMessage(`⚠️ | قم باختيار خيار n1. تسجيل\n2.انشاء\n\n`, threadID, messageID)
      return
    }
    if (!user.bankAccuunt) {
      switch (action) {
        case 'تسجيل':
          api.sendMessage('🌝 | قريباً...', threadID, messageID)
          break;


        case 'انشاء':
          if (user.money < bankMony) {
            api.sendMessage('⚠️ | ليس لديك ما يكفي لانشاء بنك', threadID, messageID)
            return
          }
          const name = args [1]
          if (!name) {
            api.sendMessage('⚠️ | قم بتضمين اسم للبنك.', threadID, messageID)
            return
          }
          await makeBank({
            name: name,
            createdAt: new Date().toLocaleDateString(),
            owner: user.id
          })
          api.sendMessage('🐦 | لقد أنشات بنك بنجاح.', threadID, messageID)
          user.bankAccuunt = true
          user.money -= bankMony
          await updateUser(user.id, user)
          break;

      }
    }

  }
}