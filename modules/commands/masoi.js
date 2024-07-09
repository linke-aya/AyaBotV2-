const players = [];
const roles = {};
let protectedPlayer = null;
let gameStarted = false;
let werewolf = null;
let guard = null;
let witchPlayer = null;
let seer = null;
let lovers = [];
let hunter = null;
let littleGirl = null;
let strongMan = null;
let thief = null;
let preacher = null;
let detective = null;
let votes = {};
let currentPhase = 'night';
let currentActionPlayer = null;
let deadPlayers = [];
let werewolfTarget = null;
let thiefStolenRole = null;
const witch = {
  healPotion: true,
  killPotion: true,
};

module.exports = {
  name: 'المستذئب',
  type: '❍ الالـعاب ❍',
  version: "1.3.0",
  description: 'لعبة المستذئب: حاول معرفة من هو المستذئب!',
  execute: async function(api, event) {
    if (event.isGroup) {
      const command = event.body.split(' ')[1];
      switch (command) {
        case 'بدء':
          startGame(api, event);
          break;
        case 'انضمام':
          joinGame(api, event);
          break;
        case 'تصويت':
          makeVote(api, event);
          break;
        default:
          api.sendMessage('استخدم الأوامر: بدء، انضمام، تصويت.', event.threadID);
      }
    } else {
      handlePrivateMessages(api, event);
    }
  }
};

async function startGame(api, event) {
  if (gameStarted) {
    api.sendMessage('اللعبة بالفعل قيد التشغيل!', event.threadID);
    return;
  }
  if (players.length < 4) {
    api.sendMessage('يجب أن يكون هناك 4 لاعبين على الأقل للبدء.', event.threadID);
    return;
  }

  gameStarted = true;

  const allRoles = ['المستذئب', 'قروي', 'قروي', 'قروي', 'الحارس', 'الساحرة', 'العراف', 'الصياد', 'الطفلة الصغيرة', 'الرجل القوي', 'السارق', 'العاشق', 'المبشر', 'المحقق'];
  let availableRoles = allRoles.slice(0, players.length);

  // ضمان وجود مستذئب واحد على الأقل
  availableRoles[0] = 'المستذئب';
  
  for (let i = 0; i < players.length; i++) {
    let roleIndex = Math.floor(Math.random() * availableRoles.length);
    roles[players[i]] = availableRoles[roleIndex];
    availableRoles.splice(roleIndex, 1);
  }

  // تعيين العاشقين بشكل عشوائي
  if (roles.includes('العاشق')) {
    let lover1 = players[Math.floor(Math.random() * players.length)];
    let lover2;
    do {
      lover2 = players[Math.floor(Math.random() * players.length)];
    } while (lover1 === lover2);

    lovers.push(lover1, lover2);
  }

  for (let player in roles) {
    sendRoleInfo(api, player, roles[player]);
  }

  api.sendMessage('اللعبة بدأت! حاولوا معرفة من هو المستذئب.', event.threadID);
  nextPhase(api);
}

async function joinGame(api, event) {
  if (gameStarted) {
    api.sendMessage('لا يمكنك الانضمام إلى اللعبة بعد أن بدأت.', event.threadID);
    return;
  }

  if (!players.includes(event.senderID)) {
    players.push(event.senderID);
    api.sendMessage('تم الانضمام إلى اللعبة!', event.threadID);
  } else {
    api.sendMessage('أنت بالفعل في اللعبة.', event.threadID);
  }
}

async function makeVote(api, event) {
  if (!gameStarted) {
    api.sendMessage('لم تبدأ اللعبة بعد.', event.threadID);
    return;
  }
  if (currentPhase !== 'day') {
    api.sendMessage('ليس وقت التصويت الآن.', event.threadID);
    return;
  }

  const vote = event.body.split(' ')[2];
  if (!votes[event.senderID]) {
    votes[event.senderID] = vote;
    api.sendMessage(`تم التصويت بنجاح.`, event.senderID);
  } else {
    api.sendMessage('لقد صوتت بالفعل.', event.senderID);
  }

  if (Object.keys(votes).length === players.length) {
    const voteCounts = {};
    for (const playerVote of Object.values(votes)) {
      voteCounts[playerVote] = (voteCounts[playerVote] || 0) + 1;
    }

    let maxVotes = 0;
    let votedOutPlayer = null;
    for (const player in voteCounts) {
      if (voteCounts[player] > maxVotes) {
        maxVotes = voteCounts[player];
        votedOutPlayer = player;
      }
    }

    api.sendMessage(`تم طرد اللاعب: ${votedOutPlayer}.`, event.threadID);
    players.splice(players.indexOf(votedOutPlayer), 1);
    deadPlayers.push(votedOutPlayer);
    handleHunterDeath(api, votedOutPlayer);

    if (roles[votedOutPlayer] === 'المستذئب') {
      api.sendMessage('مبروك! لقد فاز القرويون!', event.threadID);
      resetGame(api, event);
    } else {
      api.sendMessage('اللعبة تستمر. المستذئب لا يزال طليقاً.', event.threadID);
      nextPhase(api);
    }
  }
}

function nextPhase(api) {
  switch (currentPhase) {
    case 'night':
      currentPhase = 'werewolf';
      currentActionPlayer = getPlayerByRole('المستذئب');
      api.sendMessage('المستذئب، اختر ضحيتك.', currentActionPlayer);
      break;
    case 'werewolf':
      currentPhase = 'guard';
      currentActionPlayer = getPlayerByRole('الحارس');
      if (currentActionPlayer) {
        api.sendMessage('الحارس، اختر شخصًا لتحميه.', currentActionPlayer);
      } else {
        nextPhase(api);
      }
      break;
    case 'guard':
      currentPhase = 'witch';
      currentActionPlayer = getPlayerByRole('الساحرة');
      if (currentActionPlayer) {
        api.sendMessage('الساحرة، اختر عملك (شفاء/قتل) وشخصًا.', currentActionPlayer);
      } else {
        nextPhase(api);
      }
      break;
    case 'witch':
      currentPhase = 'seer';
      currentActionPlayer = getPlayerByRole('العراف');
      if (currentActionPlayer) {
        api.sendMessage('العراف، اختر شخصًا لكشف هويته.', currentActionPlayer);
      } else {
        nextPhase(api);
      }
      break;
    case 'seer':
      currentPhase = 'preacher';
      currentActionPlayer = getPlayerByRole('المبشر');
      if (currentActionPlayer) {
        api.sendMessage('المبشر، اختر شخصًا لتحوله إلى قروي.', currentActionPlayer);
      } else {
        nextPhase(api);
      }
      break;
    case 'preacher':
      currentPhase = 'detective';
      currentActionPlayer = getPlayerByRole('المحقق');
      if (currentActionPlayer) {
        api.sendMessage('المحقق، اختر شخصًا للتحقيق معه.', currentActionPlayer);
      } else {
        nextPhase(api);
      }
      break;
    case 'detective':
      currentPhase = 'day';
      votes = {};
      api.sendMessage('النهار قد طلع! الجم يعلم الجميع للتصويت على من يعتقدون أنه المستذئب.', event.threadID);
      break;
    case 'day':
      handleDayVotes(api, event);
      break;
    default:
      currentPhase = 'night';
      nextPhase(api);
      break;
  }
}

function handleDayVotes(api, event) {
  const voteCounts = {};
  for (const playerVote of Object.values(votes)) {
    voteCounts[playerVote] = (voteCounts[playerVote] || 0) + 1;
  }

  let maxVotes = 0;
  let votedOutPlayer = null;
  for (const player in voteCounts) {
    if (voteCounts[player] > maxVotes) {
      maxVotes = voteCounts[player];
      votedOutPlayer = player;
    }
  }

  if (votedOutPlayer) {
    api.sendMessage(`تم طرد اللاعب: ${votedOutPlayer}.`, event.threadID);
    players.splice(players.indexOf(votedOutPlayer), 1);
    deadPlayers.push(votedOutPlayer);
    handleHunterDeath(api, votedOutPlayer);

    if (roles[votedOutPlayer] === 'المستذئب') {
      api.sendMessage('مبروك! لقد فاز القرويون!', event.threadID);
      resetGame(api, event);
    } else {
      api.sendMessage('اللعبة تستمر. المستذئب لا يزال طليقاً.', event.threadID);
      nextPhase(api);
    }
  } else {
    api.sendMessage('لم يتم اختيار لاعب للطرد. تستمر اللعبة.', event.threadID);
    nextPhase(api);
  }
}

function handleHunterDeath(api, player) {
  if (roles[player] === 'الصياد' && !deadPlayers.includes(player)) {
    api.sendMessage(`الصياد، اختر لاعبًا لتأخذه معك.`, player);
    // Wait for the hunter to respond and choose a player
    // Handle the chosen player logic here
  }
}

function resetGame(api, event) {
  players.length = 0;
  Object.keys(roles).forEach(key => delete roles[key]);
  protectedPlayer = null;
  gameStarted = false;
  werewolf = null;
  guard = null;
  witchPlayer = null;
  seer = null;
  lovers.length = 0;
  hunter = null;
  littleGirl = null;
  strongMan = null;
  thief = null;
  preacher = null;
  detective = null;
  votes = {};
  currentPhase = 'night';
  currentActionPlayer = null;
  deadPlayers.length = 0;
  werewolfTarget = null;
  thiefStolenRole = null;
  witch.healPotion = true;
  witch.killPotion = true;
}

function getPlayerByRole(role) {
  return Object.keys(roles).find(player => roles[player] === role);
}

function sendRoleInfo(api, player, role) {
  let roleDescription;
  switch (role) {
    case 'المستذئب':
      roleDescription = 'أنت المستذئب! حاول القضاء على القرويين دون أن يكتشفوا هويتك.';
      break;
    case 'قروي':
      roleDescription = 'أنت قروي عادي. حاول اكتشاف المستذئب ومساعدة زملائك القرويين.';
      break;
    case 'الحارس':
      roleDescription = 'أنت الحارس. يمكنك حماية شخص واحد كل ليلة من هجوم المستذئب.';
      break;
    case 'الساحرة':
      roleDescription = 'أنت الساحرة. لديك جرعة شفاء واحدة وجرعة قتل واحدة. استخدمهما بحكمة.';
      break;
    case 'العراف':
      roleDescription = 'أنت العراف. يمكنك معرفة هوية لاعب واحد كل ليلة.';
      break;
    case 'الصياد':
      roleDescription = 'أنت الصياد. إذا قُتلت، يمكنك أخذ لاعب آخر معك.';
      break;
    case 'الطفلة الصغيرة':
      roleDescription = 'أنت الطفلة الصغيرة. يمكنك التجسس على المستذئبين دون أن يلاحظوا.';
      break;
    case 'الرجل القوي':
      roleDescription = 'أنت الرجل القوي. لا يمكن طردك بسهولة.';
      break;
    case 'السارق':
      roleDescription = 'أنت السارق. يمكنك سرقة هوية لاعب آخر.';
      break;
    case 'العاشق':
      roleDescription = 'أنت العاشق. لديك شريك في اللعبة. إذا مات شريكك، تموت أنت أيضاً.';
      break;
    case 'المبشر':
      roleDescription = 'أنت المبشر. يمكنك تحويل لاعب واحد إلى قروي.';
      break;
    case 'المحقق':
      roleDescription = 'أنت المحقق. يمكنك التحقيق مع لاعب واحد كل ليلة لمعرفة دوره.';
      break;
    default:
      roleDescription = 'دور غير معروف.';
  }

  api.sendMessage(`دورك في اللعبة: ${roleDescription}`, player);
}

function handlePrivateMessages(api, event) {
  const senderID = event.senderID;
  const message = event.body.toLowerCase();

  if (!gameStarted) {
    api.sendMessage('اللعبة لم تبدأ بعد. استخدم الأمر "انضمام" للانضمام إلى اللعبة.', senderID);
    return;
  }

  const role = roles[senderID];
  if (!role) {
    api.sendMessage('أنت لست جزءًا من اللعبة.', senderID);
    return;
  }

  switch (role) {
    case 'المستذئب':
      if (currentPhase === 'werewolf') {
        const target = message.split(' ')[1];
        if (players.includes(target)) {
          werewolfTarget = target;
          api.sendMessage('لقد اخترت ضحيتك.', senderID);
          nextPhase(api);
        } else {
          api.sendMessage('اللاعب غير موجود.', senderID);
        }
      }
      break;

    case 'الحارس':
      if (currentPhase === 'guard') {
        const target = message.split(' ')[1];
        if (players.includes(target)) {
          protectedPlayer = target;
          api.sendMessage('لقد اخترت الشخص الذي ستحميه.', senderID);
          nextPhase(api);
        } else {
          api.sendMessage('اللاعب غير موجود.', senderID);
        }
      }
      break;

    case 'الساحرة':
      if (currentPhase === 'witch') {
        const action = message.split(' ')[1];
        const target = message.split(' ')[2];
        if (action === 'شفاء' && witch.healPotion) {
          protectedPlayer = werewolfTarget;
          witch.healPotion = false;
          api.sendMessage('لقد استخدمت جرعة الشفاء.', senderID);
          nextPhase(api);
        } else if (action === 'قتل' && witch.killPotion && players.includes(target)) {
          deadPlayers.push(target);
          witch.killPotion = false;
          api.sendMessage('لقد استخدمت جرعة القتل.', senderID);
          nextPhase(api);
        } else {
          api.sendMessage('الإجراء أو اللاعب غير صالح.', senderID);
        }
      }
      break;

    case 'العراف':
      if (currentPhase === 'seer') {
        const target = message.split(' ')[1];
        if (players.includes(target)) {
          api.sendMessage(`هوية اللاعب ${target}: ${roles[target]}`, senderID);
          nextPhase(api);
        } else {
          api.sendMessage('اللاعب غير موجود.', senderID);
        }
      }
      break;

    case 'المبشر':
      if (currentPhase === 'preacher') {
        const target = message.split(' ')[1];
        if (players.includes(target)) {
          roles[target] = 'قروي';
          api.sendMessage('لقد حولت اللاعب إلى قروي.', senderID);
          nextPhase(api);
        } else {
          api.sendMessage('اللاعب غير موجود.', senderID);
        }
      }
      break;

    case 'المحقق':
      if (currentPhase === 'detective') {
        const target = message.split(' ')[1];
        if (players.includes(target)) {
          api.sendMessage(`تحقيقك يكشف أن اللاعب ${target} هو ${roles[target]}.`, senderID);
          nextPhase(api);
        } else {
          api.sendMessage('اللاعب غير موجود.', senderID);
        }
      }
      break;

    case 'الصياد':
      if (currentPhase === 'day' && deadPlayers.includes(senderID)) {
        const target = message.split(' ')[1];
        if (players.includes(target)) {
          api.sendMessage(`الصياد قد أخذ معه اللاعب ${target}.`, event.threadID);
          players.splice(players.indexOf(target), 1);
          deadPlayers.push(target);
          nextPhase(api);
        } else {
          api.sendMessage('اللاعب غير موجود.', senderID);
        }
      }
      break;

    default:
      api.sendMessage('دورك غير مدعوم للرسائل الخاصة.', senderID);
  }
}