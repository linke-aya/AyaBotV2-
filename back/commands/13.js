const { getUser, updateUser, deleteUser, saveUser } = require('../global/user');

const log = require('../system/logger');


module.exports = {
  name: "حساب",
  type: 'الاموال',
  updatedAt: '2024/7/20',
  otherName: ["حسابي"],
  usage: 'حساب',
  usageCount: 0,
  info: 'قم بإدارة حسابك على المنصة',
  run: async (api, event) => {
    const args = event.body.split(' ').slice(1);
    const action = args[0];
    const Id = event.senderID;

    const user = await getUser(Id);

    if (!user || !user.haveAccuunt) {
      handleCreateAccount(api, event, args, user, Id)
    } else if (user.loggedIn) {
      if (!action) {
        api.sendMessage(`───────
1. معلومات
───────
2. تغيير_اسم

───────
`, event.threadID, async (err, info) => {
          if (err) {
            console.error(err);
          } else {
            console.log(info)
            handle(event, api, info.messageID)
          }
        });
      }

      switch (action) {
        case 'تغيير_اسم':
          await handleChangeName(api, event, user, args.slice(1));
          break;

        case 'معلومات':
          sendAccountInfo(api, event, user);
          break;


      }
    }





  }
}


async function handle(event, api, messageId) {

  if (event.type === "message_reply" && event.messageReply.messageID === messageId) {

    const reply = event.message_reply
    switch (reply.body) {
      case '1':
        await handleChangeName(api, event, user, args.slice(1));
        break;

      case '2':
        sendAccountInfo(api, event, user);
        break;


    }
  }
}

async function handleCreateAccount(api, event, args, user, Id) {
  const name = args[1];
  const pass = args[2];
  if (args.length < 2) {
    api.sendMessage('⚠️ | خطأ قم بادخال إسمك ثم كلمة المرور', event.threadID, event.messageID)
  }
  if (!user) {
    try {
      await api.getUserInfo(Id, (err, info) => {
        if (err) logger.error(err)
        const userName = info.name
        const Newuser = {
          userName: userName,
          id: Id,
          img: info.profileUrl,
          name: name.trim(),
          money: 0,
          createdAt: new Date().toLocaleDateString(),
          reank: 'برونز',
          exp: 0,
          password: pass.trim(),
          haveAccuunt: true 
        };
        saveNewUser(Newuser);
        api.sendMessage(`🌝 | لقد انشأت حساب بنجاح.`, event.threadID, event.messageID)
      })
    } catch (error) {
      logger.error(error);
      api.sendMessage(`⚠️ | حدث خطأ.`, event.threadID, event.messageID);
    }
  }
  if (user && !user.haveAccuunt) {
    user.name = name.trim()
    user.createdAt = new Date().toLocaleDateString()
    user.reank = 'برونز'
    user.exp = 0
    user.password = pass.trim()
    haveAccuunt: true 
    updateUser(Id, user);
    api.sendMessage(`🌝 | لقد انشأت حساب بنجاح.`, event.threadID, event.messageID)
  }
}


async function sendAccountInfo(api, event, user) {
  let accountInfo = `     『　あっくえんｔ　』\n`
  accountInfo += `◈الاسم ＞ ${user.name}\n◈النقود ＞ ${user.money} جنيه\n◈الرتبة ＞ ${user.rank}\n◈انشأء ＞ ${user.createdAt}\n◈نبذة ＞ ${user.info}`

  api.sendMessage(accountInfo, event.threadID, event.messageID);
}




async function handleChangeName(api, event, user, args) {
  const newName = args.slice(0).join(" ");
  if (!newName) {
    api.sendMessage('⚠️ | لا يمكن للاسم الجديد ان يكون فارغاً.', event.threadID, event.messageID);
    return;
  }

  try {
    await updateUserDate(user.id, { name: newName });
    api.sendMessage(`🐦 | لقد غييرت اسمك بنجاح.`, event.threadID, event.messageID);
  } catch (error) {
    logger.error(error);
    api.sendMessage(`⚠️ | حدث خطأ.`, event.threadID, event.messageID);
  }
}