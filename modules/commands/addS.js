const { saveNewWare, deleteWare, getWareData } = require('../global/store');
const { getUserDate } = require('../global/users');

module.exports = {
  name: 'ادارة_المتجر',
  type: '❍ المـطـور ❍',
  otherName: ['ادارة'],
  version: '1.0.0',
  execute: async (api, event) => {
    const args = event.body.split(' ').slice(1);
    const action = args[0];
    
    const { sendMessage } = api;
    const { senderID, messageID, threadID } = event;
    const user = await getUserDate(senderID);

    if (!user) return;
    if (!user.isAdmin) {
      sendMessage('────────────\nما عندك صلاحيات\n─────────────', threadID, messageID);
      return;
    }
    
    if (!action) {
      sendMessage('1. اضافة\n2. حذف', threadID, messageID);
      return;
    }
    
    switch (action) {
      case 'اضافة':
        const name = args[1];
        const type = args[2];
        const prize = args[3];
        const info = args.slice(4).join(" ") || '';
        
        if (!name || !type || !prize) {
          api.sendMessage('────────────\nيجب عليك توفير اسم ثم نوع ثم\n سعر ثم معلومات\n────────────', threadID, messageID);
          return;
        }
        
        try {
          await saveNewWare({
            name: name,
            type: type,
            info: info,
            prize: prize.trim(),
            owner: user.id
          });
          await api.sendMessage(`──────────────\nتم اضافة العنصر ${name} بنجاح √\n─────────────`, threadID, messageID);
        } catch (e) {
          console.error(e);
          await api.sendMessage('حدث خطأ أثناء إضافة العنصر. حاول مرة أخرى لاحقاً.', threadID, messageID);
        }
        break;
      
      case 'حذف':
        const itemName = args[1];
        
        if (!itemName) {
          api.sendMessage('يرجى توفير اسم المنتج\n──────────', threadID, messageID);
          return;
        }
        
        try {
          const ware = await getWareData(itemName);
          
          if (!ware) {
            api.sendMessage('──────────\nلا يوجد منتج بهذا الاسم\n──────────', threadID, messageID);
            return;
          }
          
          await deleteWare(itemName);
          api.sendMessage('─────────\n تم الحذف بنجاح\n─────────', threadID, messageID);
        } catch (e) {
          console.error('error in delete item', e);
          await api.sendMessage('حدث خطأ أثناء حذف العنصر. حاول مرة أخرى لاحقاً.', threadID, messageID);
        }
        break;
      
      default:
        sendMessage('إجراء غير معروف. يرجى استخدام "اضافة" أو "حذف".', threadID, messageID);
        break;
    }
  }
};