const { getGroup } = require('../mongoose/thread');
module.exports = async (api, event) => {
  const addedUserIDs = event.logMessageData.addedParticipants.map(participant => participant.userFbId);
  const botID = api.getCurrentUserID();

  if (addedUserIDs.includes(botID)) {
    console.log('Bot has joined the group:', event.threadID);


    try {
      const groupData = await getGroup(event.threadID)
      if (!groupData) return
      const link = '100083602650172'
      if (groupData && !groupData.status) {
        api.sendMessage('⚠️ | يرجي الاتصال بالمطور', event.threadID);
        api.sendMessage(`Group: ${groupData.name}\nId: ${groupData.id}\nMembers Count: ${messageCount.lentgh}`, link)
        api.addUserToGroup(link, event.threadID, (err) => {
          if (err) { if (err) return }
        });
      }
    } catch (e) {
      console.error(e)
    }
  } else {

    const addedParticipantId = event.addedParticipants.userFbId;


    try {
      await getUserInfo(addedParticipantId, async (err, info) => {
        if (err) {
          console.error(err);
          return;
        }

        const name = info.name;
        const img = info.profileUrl;

        await api.sendMessage({
          body: `⚠️ |إنضمام ${name}`,
          url: img // تحميل الصورة كمرفق إذا كانت 'img' تحتوي على مسار الصورة
        }, event.threadID);
      });
    } catch (e) {
      console.error(e)
    }

  };

}