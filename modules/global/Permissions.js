const config = require('../../config/config');
const { getUserData } = require('./users'); // تأكد من استخدام المسار الصحيح لملف المستخدمين


const util = require('util');

function getThreadInfoPromise(api, threadID) {
  return new Promise((resolve, reject) => {
    api.getThreadInfo(threadID, (err, info) => {
      if (err) {
        reject(err);
      } else {
        resolve(info);
      }
    });
  });
}


const permissionLevels = [0, 1, 2]; // 0: user, 1: groupAdmin, 2: botAdmin

async function getUserPermissionLevel(api, userID, threadID) {
  try {
    // التحقق من مستوى الإدارة للمستخدم
    if (userID === config.admin) {
      return 2; // مستوى إداري عالٍ
    }

    // احصل على معلومات المحادثة
    const info = await getThreadInfoPromise(api, threadID);
    const isAdminInGroup = info.adminIDs.some(admin => admin.id === userID);
    return isAdminInGroup ? 1 : 0; // 1 لمدير المجموعة، 0 للمستخدم العادي
  } catch (error) {
    console.error('Error in getUserPermissionLevel:', error);
    throw error; // رمي الخطأ للتعامل به خارج هذه الوظيفة
  }
}

async function hasPermission(api, userID, threadID, requiredPermission) {
  try {
    const userPermissionLevel = await getUserPermissionLevel(api, userID, threadID);
    return userPermissionLevel >= requiredPermission;
  } catch (error) {
    console.error('Error in hasPermission:', error);
    return false;
  }
}

module.exports = {
  hasPermission,
  permissionLevels,
};