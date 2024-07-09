const config = require('../../config/config');
const logger = require('../system/logger');


module.exports = {
  name: 'معرف',
  type: '❍ المجمـوعات ❍',
  description: 'استخراج معرف المجموعة ',
  hasPermission: 0,
  execute: (api, event) => {
   api.sendMessage(event.threadID, event.threadID)

 }
};