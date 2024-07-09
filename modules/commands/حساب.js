const { getUserDate, updateUserDate, sendFriendRequest, acceptFriendRequest, deleteUserDate, saveNewUser } = require('../global/users');
const config = require('../../config/config');
const logger = require('../system/logger');


module.exports = {
  name: "حساب",
  type: '❍ الـاموال ❍',
  otherName: ["حسابي"],
  usage: 'حساب',
  hasPermission: 0,
  description: 'قم بإدارة حسابك على المنصة',

  execute: async (api, event) => {
    const args = event.body.split(' ').slice(1);
    const action = args[0];
    const Id = event.senderID;

    const user = await getUserDate(Id);

    if (!user || !user.loggedIn) {
      switch (action) {
        case 'انشاء':
          await handleCreateAccount(api, event, args, user, Id);
          break;

        case 'تسجيل_دخول':
          await handleLogin(api, event, args, user, Id);
          break;

        default:
          await setReachion(api, `🗿`, event.messageID);
          api.sendMessage(`────────────────────────
- يرجي الاختيار بين :
1. انشاء       
2. تسجيل_دخول
────────────────────────`, event.threadID, event.messageID);
          break;
      }
    } else if (user.loggedIn) {
      if (!action) {
        api.sendMessage(`───────
1. طلب
─────
2. الطلبات
─────
3. قبول
─────
4. حذف_حسابي
─────
5. معلومات
───────
6.تغيير_اسم
───────
7. الخزنة
───────
`, event.threadID, async (err, info) => {
          if (err) {
            console.error(err);
          } else {
            console.log(info)
            // await handle(event, api);
          }
        });
      }
      // handle(event, api)
      switch (action) {
        case 'طلب':
          await setReachion(api, `:like:`, event.messageID);
          await handleSendFriendRequest(api, event, user, args.slice(1));
          break;

        case 'قبول':
          await setReachion(api, ':like:', event.messageID);
          await handleAcceptFriendRequest(api, event, user, args.slice(1));
          break;

        case 'حذف_حسابي':
          await setReachion(api, '👎', event.messageID);
          await handleDeleteAccount(api, event, user);
          break;

        case 'تغيير_اسم':
          await setReachion(api, '⏰', event.messageID);
          await handleChangeName(api, event, user, args.slice(1));
          break;

        case 'معلومات':
          await setReachion(api, '⏰', event.messageID);
          sendAccountInfo(api, event, user);
          break;

        case 'الطلبات':
          await setReachion(api, '⏰', event.messageID);
          await sendPendingFriendRequests(api, event, user);
          break;

        case 'الخزنة':
          await setReachion(api, `👍🏻`, event.messageID);
          await seeWars(api, event, user);
          break;
      }
    }





  }
}


async function handle(event, api) {
  
  if (event.type === "message_reply") {
   
    const reply = event.message_reply
    switch (reply.body) {
      case '1':
        await setReachion(api, `:like:`, event.messageID);
        await handleSendFriendRequest(api, event, user, args.slice(1));
        break;

      case '2':
        await setReachion(api, '👍', event.messageID);
        await handleAcceptFriendRequest(api, event, user, args.slice(1));
        break;

      case '3':
        await setReachion(api, '👎', event.messageID);
        await handleDeleteAccount(api, event, user);
        break;

      case '4':
        await setReachion(api, '⏰', event.messageID);
        await handleChangeName(api, event, user, args.slice(1));
        break;

      case '5':
        await setReachion(api, '⏰', event.messageID);
        sendAccountInfo(api, event, user);
        break;

      case '6':
        await setReachion(api, '⏰', event.messageID);
        await sendPendingFriendRequests(api, event, user);
        break;

      case '7':
        await setReachion(api, '⏰', event.messageID);
        await seeWars(api, event, user);
        break;
    }
  }
}

async function handleCreateAccount(api, event, args, user, Id) {
  if (user) {
    await api.setMessageReaction("🤦🏻‍♀️", event.messageID);
    api.sendMessage(`────────────────────────
- لديك حساب بالفعل قم بتسجيل الدخول
حساب تسجيل_دخول {كلمة المرور}
────────────────────────`, event.threadID, event.messageID);
    return;
  }

  if (args.length < 3) {
    await setReachion(api, `:error:`, event.messageID);
    api.sendMessage(`────────────────────────
- لإنشاء حساب اكتب
حساب انشاء {اسمك} {كلمة المرور}   
────────────────────────`, event.threadID, event.messageID);
    return;
  }

  const name = args[1];
  const pass = args[2];



  try {
    await api.getUserInfo(Id, (err, info) => {
      if (err) logger.error(err)
      const userName = info.name
      const Newuser = {
        userName: userName,
        id: Id,
        name: name.trim(),
        money: 10,
        createdAt: new Date().toLocaleDateString(),
        transactions: 0,
        loggedIn: true,
        level: 1,
        health: 100,
        exp: 0,
        password: pass.trim()
      };
      saveNewUser(Newuser);
      api.sendMessage(`────────────────────────
- مبروك لقد انشات حساب بنجاح   
لقد حصلت 10$ هدية تحفيزية   
اكتب حساب لرؤية الميزات     
────────────────────────`, event.threadID, event.messageID)
    })
  } catch (error) {
    logger.error(error);
    api.sendMessage(`────────────────────────
- حدث خطأ في النظام حاول لاحقاً
────────────────────────`, event.threadID, event.messageID);
  }
}

async function handleLogin(api, event, args, user, Id) {
  if (!user) {
    await api.setMessageReaction(`:crous:`, event.messageID);
    api.sendMessage(`────────────────────────
- ليس لديك حساب قم بانشاء حساب اولا
────────────────────────`, event.threadID, event.messageID);
    return;
  }

  if (args.length < 2) {
    await api.setMessageReaction("🤦🏻‍♀️", event.messageID);
    api.sendMessage(`────────────────────────
- استخدام خاطئ
تسجيل_دخول {كلمة المرور}
────────────────────────`, event.threadID, event.messageID);
    return;
  }

  const password = args[1];
  if (user.password === password) {
    user.loggedIn = true;
    user.money += 100;
    await updateUserDate(Id, { loggedIn: true });
    api.sendMessage(`────────────────────────
- لقد قمت بتسجيل الدخول بنجاح.  
لقد حصلت علي 100$ هدية  
────────────────────────`, event.threadID, event.messageID);
  } else {
    await api.setMessageReaction("🤦🏻‍♀️", event.messageID);
    api.sendMessage(`────────────────────────
- كلمة المرور غير صحيحة
ألست ${user.name}؟  
────────────────────────`, event.threadID, event.messageID);
  }
}

async function sendAccountInfo(api, event, user) {
  const accountInfo =
    `      
معلومات الحساب                  
─────────────────────
│ الاسم: ${user.name} .
│ النقود: ${user.money}$ . 
│ تاريخ الإنشاء: ${user.createdAt} .
│ عدد المعاملات: ${user.transactions} .  
│ الصحة: ${user.health} .
│ المستوى: ${user.level} .    
│ نقاط : ${user.exp} .
│ ادمن : ${user.isAdmin} .
─────────────────────
`;

  api.sendMessage(accountInfo, event.threadID, event.messageID);
}

async function sendPendingFriendRequests(api, event, user) {
  try {
    if (!user.friendRequests) {
      api.sendMessage('لا توجد طلبات صداقة معلقة', event.threadID, event.messageID);
      return;
    }

    const pendingRequests = await Promise.all(user.friendRequests.map(async (ids) => {
      const request = await FriendRequest.findOne().populate('senderId');
      return `───────\n${request.senderId.name}───────\n ${request.senderId.id}`;
    }));

    if (pendingRequests.length === 0) {
      api.sendMessage('لا توجد طلبات صداقة معلقة', event.threadID, event.messageID);
    } else {
      const pendingList = pendingRequests.join('\n');
      api.sendMessage(`طلبات الصداقة المعلقة:\n${pendingList}`, event.threadID, event.messageID);
    }
  } catch (error) {
    logger.error(error);
    api.sendMessage('حدث خطأ أثناء جلب طلبات الصداقة المعلقة', event.threadID, event.messageID);
  }
}

async function handleSendFriendRequest(api, event, user, args) {
  const receiverId = args[0];
  if (!receiverId) {
    api.sendMessage(`────────────────────────
يرجي ادخال اسم او ايدي المستخدم المراد
────────────────────────`, event.threadID, event.messageID);
    return;
  }

  try {
    const receiver = await getUserDate(receiverId);
    if (!receiver) {
      api.sendMessage(`────────────────────────
المستخدم غير موجود 
────────────────────────`, event.threadID, event.messageID);
      return;
    }

    await sendFriendRequest(user.id, receiver.id, `${user.id}${receiver.id}`);
    api.sendMessage(`────────────────────────
تم ارسال طلب الصداقة بنجاح
────────────────────────`, event.threadID, event.messageID);
  } catch (error) {
    logger.error(error);
    api.sendMessage(`────────────────────────
حدث خطأ أثناء إرسال طلب الصداقة
────────────────────────`, event.threadID, event.messageID);
  }
}

async function handleAcceptFriendRequest(api, event, user, args) {
  const requesterId = args[0];
  if (!requesterId) {
    api.sendMessage(`────────────────────────
يرجي ادخال اسم او ايدي المستخدم المراد
قبول طلب الصداقة منه
────────────────────────`, event.threadID, event.messageID);
    return;
  }

  try {
    const requester = await getUserDate(requesterId);
    if (!requester) {
      api.sendMessage(`────────────────────────
المستخدم غير موجود 
────────────────────────`, event.threadID, event.messageID);
      return;
    }

    await acceptFriendRequest(user.id, requester.id);
    api.sendMessage(`────────────────────────
تم قبول طلب الصداقة بنجاح
────────────────────────`, event.threadID, event.messageID);
  } catch (error) {
    logger.error(error);
    api.sendMessage(`────────────────────────
حدث خطأ أثناء قبول طلب الصداقة
────────────────────────`, event.threadID, event.messageID);
  }
}

async function handleDeleteAccount(api, event, user) {
  try {
    await deleteUserDate(user.id);
    api.sendMessage(`────────────────────────
تم حذف حسابك بنجاح
────────────────────────`, event.threadID, event.messageID);
  } catch (error) {
    logger.error(error);
    api.sendMessage(`────────────────────────
حدث خطأ أثناء حذف الحساب
────────────────────────`, event.threadID, event.messageID);
  }
}

async function handleChangeName(api, event, user, args) {
  const newName = args.slice(0).join(" ");
  if (!newName) {
    api.sendMessage(`────────────────────────
يرجي ادخال الاسم الجديد
────────────────────────`, event.threadID, event.messageID);
    return;
  }

  try {
    await updateUserDate(user.id, { name: newName });
    api.sendMessage(`────────────────────────
تم تغيير الاسم بنجاح
────────────────────────`, event.threadID, event.messageID);
  } catch (error) {
    logger.error(error);
    api.sendMessage(`────────────────────────
حدث خطأ أثناء تغيير الاسم
────────────────────────`, event.threadID, event.messageID);
  }
}

async function seeWars(api, event, user) {
  const items = user.items
  if (items.length < 0) {
    api.sendMessage(
      `────────────────────────
   ليس لديك شي في خزنتك
────────────────────────`, event.threadID, event.messageID);
    return
  }
  const end = items.join('\n')
  api.sendMessage(`─────────────\n${end}\n──────────────`, event.threadID, event.messageID)
}
async function setReachion(api, reachion, messageID) {
  api.setMessageReaction(reachion, messageID, (err) => {
    if (err) console.error('Filed Set Reachion ', err)
  })
}