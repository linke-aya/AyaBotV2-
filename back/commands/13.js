const { getUser, updateUser, saveUser, deleteUser } = require('../mongoose/user');
const log = require('../global/logger');


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
    
    try {
      const user = await getUser(Id);

      if (!user || !user.haveAccount) {
        await handleCreateOrUpdateAccount(api, event, args, user, Id);
      } else if (user.loggedIn) {
        if (!action) {
          await showMenu(api, event);
        } else {
          await handleUserActions(api, event, user, action, args.slice(1));
        }
      }
    } catch (error) {
      log.error(error);
      api.sendMessage('⚠️ | حدث خطأ أثناء معالجة طلبك.', event.threadID, event.messageID);
    }
  }
};

// عرض القائمة الرئيسية للمستخدم
async function showMenu(api, event) {
  api.sendMessage(`───────
1. معلومات
───────
2. تغيير_اسم
───────
3. حذف_الحساب
───────
4. الاصدقاء
───────
`, event.threadID, (err, info) => {
    if (err) {
      log.error(err);
    }
    log.system(info)
    api.sendMessage(info.toString(), event.threadID)
  });
}

// معالجة الإجراءات المختلفة للمستخدم
async function handleUserActions(api, event, user, action, args) {
  switch (action) {
    case 'تغيير_اسم':
      await handleChangeName(api, event, user, args);
      break;

    case 'معلومات':
      await sendAccountInfo(api, event, user);
      break;

    case 'تغيير_كلمة_المرور':
      await handleChangePassword(api, event, user, args);
      break;

    case 'حذف_الحساب':
      await handleDeleteAccount(api, event, user);
      break;
    case 'الاصدقاء':
      await handleShowFriends(api, event, user)
      break;
    
    default:
      api.sendMessage('⚠️ | الإجراء غير معروف.', event.threadID, event.messageID);
  }
}

// إنشاء أو تحديث حساب جديد
async function handleCreateOrUpdateAccount(api, event, args, user, Id) {
  const name = args[1];
  const pass = args[2];
  
  if (args.length < 3) {
    return api.sendMessage('⚠️ | خطأ: قم بإدخال اسمك ثم كلمة المرور.', event.threadID, event.messageID);
  }

  try {
    const info = await api.getUserInfo(Id);

    const newUser = {
      userName: info.name,
      id: Id,
      img: info.profileUrl,
      name: name.trim(),
      createdAt: new Date().toLocaleDateString(),
      rank: 'برونز',
      exp: 0,
      password: pass.trim(),
      haveAccount: true
    };

    if (!user) {
      await saveUser(newUser);
      api.sendMessage('🌝 | لقد أنشأت حسابك بنجاح.', event.threadID, event.messageID);
    } else {
      await updateUser(user.id, newUser);
      api.sendMessage('🌝 | تم تحديث حسابك بنجاح.', event.threadID, event.messageID);
    }
  } catch (error) {
    log.error(error);
    api.sendMessage('⚠️ | حدث خطأ أثناء إنشاء أو تحديث الحساب.', event.threadID, event.messageID);
  }
}

// إرسال معلومات الحساب للمستخدم
async function sendAccountInfo(api, event, user) {
  const accountInfo = `『　あっくえんｔ　』\n
◈ الاسم: ${user.name}\n
◈ النقود: ${user.money} جنيه\n
◈ الرتبة: ${user.rank}\n
◈ تاريخ الإنشاء: ${user.createdAt}\n
◈ نبذة: ${user.info}`;

  api.sendMessage(accountInfo, event.threadID, event.messageID);
}

// تغيير اسم المستخدم
async function handleChangeName(api, event, user, args) {
  const newName = args.join(" ").trim();
  
  if (!newName) {
    return api.sendMessage('⚠️ | لا يمكن للاسم الجديد أن يكون فارغًا.', event.threadID, event.messageID);
  }

  try {
    await updateUser(user.id, { name: newName });
    api.sendMessage('🐦 | لقد غيرت اسمك بنجاح.', event.threadID, event.messageID);
  } catch (error) {
    log.error(error);
    api.sendMessage('⚠️ | حدث خطأ أثناء تغيير الاسم.', event.threadID, event.messageID);
  }
}

// تغيير كلمة مرور المستخدم
async function handleChangePassword(api, event, user, args) {
  const newPassword = args.join(" ").trim();
  
  if (!newPassword) {
    return api.sendMessage('⚠️ | لا يمكن لكلمة المرور الجديدة أن تكون فارغة.', event.threadID, event.messageID);
  }

  try {
    await updateUser(user.id, { password: newPassword });
    api.sendMessage('🐦 | لقد غيرت كلمة المرور بنجاح.', event.threadID, event.messageID);
  } catch (error) {
    log.error(error);
    api.sendMessage('⚠️ | حدث خطأ أثناء تغيير كلمة المرور.', event.threadID, event.messageID);
  }
}

// حذف حساب المستخدم
async function handleDeleteAccount(api, event, user) {
  try {
    await deleteUser(user.id);
    api.sendMessage('⚠️ | لقد تم حذف حسابك بنجاح.', event.threadID, event.messageID);
  } catch (error) {
    log.error(error);
    api.sendMessage('⚠️ | حدث خطأ أثناء حذف الحساب.', event.threadID, event.messageID);
  }
}
function handleShowFriends(api, event, user) {
  try {
    const userFriends = user.friends
    if (userFriends.length = 0) {
      api.sendMessage('🌝 | ليس لديك اصدقاء.', event.threadID, event.messageID)
      return
    }
    const Friends = userFriends.map(friend => friend.name)
    api.sendMessage(Friends.join('\n'), event.threadID, event.messageID)
  } catch (e) {
    log.error(e)
    api.sendMessage("⚠️ | error", event.threadID, event.messageID)
  }
}
