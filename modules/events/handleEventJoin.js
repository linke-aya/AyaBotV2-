const { getGroupData, saveNewGroup } = require('../global/thread');
const config= require('../../config/config')

module.exports = async (api, event) => {
  const addedUserIDs = event.logMessageData.addedParticipants.map(participant => participant.userFbId);
  const botID = api.getCurrentUserID();

  if (addedUserIDs.includes(botID)) {
    console.log('Bot has joined the group:', event.threadID);

    // الحصول على بيانات المجموعة
    try {
      const groupData = await getGroupData(event.threadID)

      // إذا كانت بيانات المجموعة غير موجودة، قم بإنشاء مجموعة جديدة
      if (!groupData) {
        try {
          await api.getThreadInfo(threadID, async (err, threadInfo) => {
            if (err) {
              console.error('Error fetching thread info:', err);
              return reject('Error fetching thread info');
            }

            const groupName = threadInfo.name;
            const groupAdmins = threadInfo.adminIDs.map(admin => admin.id);
            const groupMembers = threadInfo.participantIDs;
            const groupMessageCount = threadInfo.messageCount;
            const groupCreationTime = threadInfo.timestamp;

            const groupPhoto = threadInfo.imageSrc || ''


            await saveNewGroup({
              id: threadID,
              prefix: '.',
              name: groupName,
              admins: groupAdmins,
              members: groupMembers,
              messageCount: groupMessageCount,
              creationTime: groupCreationTime,
              img: groupPhoto,
              status: false
            })
          })

        } catch (e) {
          console.error('Error processing new group:', e);
        }
      }

      // التحقق من حالة المجموعة
      if (groupData && !groupData.status) {
        api.sendMessage('يرجي اضافة المطور للموافقة علي المجموعة ', event.threadID);
        api.sendMessage(`Group: ${groupData.name}\nId: ${groupData.id}\nMembers Count: ${messageCount.lentgh}`, config.admin)
      }
    } catch (e) {
      console.error(e)
    }
  } else {

    const addedParticipantId = event.addedParticipants.userFbId;

    // استخدم getUserInfo للحصول على معلومات المستخدم
    try {
      await getUserInfo(addedParticipantId, async (err, info) => {
        if (err) {
          console.error(err);
          return;
        }

        const name = info.name;
        const img = info.profileUrl;

        api.sendMessage({
          body: `────────────────
                         انضم مستخدم جديد            
                   ${name}
                  ────────────────`,
          url: img // تحميل الصورة كمرفق إذا كانت 'img' تحتوي على مسار الصورة
        }, event.threadID);
      });
    } catch (e) {
      console.error(e)
    }

  };

}