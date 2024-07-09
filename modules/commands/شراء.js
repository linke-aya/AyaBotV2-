const {
  getWareData,
  saveNewWare,
  deleteWare,
  updateWare,
  getAllWare
} = require('../global/store');
const { getUserDate, updateUserDate } = require('../global/users');

module.exports = {
  name: 'شراء',
  type: '❍ الـاموال ❍',
  version: '1.0.0',
  hasPermission: 0,
  description: 'الشراء من المتجر',
  execute: async (api, event) => {
    const sender = event.senderID;
    const args = event.body.split(' ').slice(1);
    const user = await getUserDate(sender);
    
    if (!user) {
      setReaction(api, ':dislike:', event.messageID);
      api.sendMessage('──────────\nطير اعمل حساب 🗿\n──────────', event.threadID, event.messageID);
      return;
    }

    const itemseller = args[0];
    
    if (!itemseller) {
      setReaction(api, ':dislike:', event.messageID);
      api.sendMessage('──────────\nادخل اسم المنتج المراد\n──────────', event.threadID, event.messageID);
      return;
    }

    const item = await getWareData(itemseller);
    if (!item) {
      setReaction(api, ':dislike:', event.messageID);
      api.sendMessage('──────────\nهذا المنتج غير موجود🗿\n──────────', event.threadID, event.messageID);
      return;
    }

    if (user.money < item.prize) {
      setReaction(api, ':dislike:', event.messageID);
      api.sendMessage('──────────\nامش كون ليك راس مال\n──────────', event.threadID, event.messageID);
      return;
    }

    const seller = await getUserDate(item.owner);
    seller.money += item.prize;
    user.money -= item.prize;
    
    // تأكد من تحديث قائمة العناصر للمستخدم
    user.items = user.items.concat(item.name);
    user.transactions += 1;

    await api.sendMessage({
      body: `══════════\nلقد اشتري ${user.name} منك ${item.name}\nولقد حصلت علي ${item.prize}\n══════════`
    }, seller.id);

    await updateUserDate(user.id, user);
    await updateUserDate(item.owner, seller);
    await deleteWare(itemseller);

    api.sendMessage({
      body: '──────────\n    تهانينا \n──────────\n- لقد اشتريت المنتج بنجاح\n──────────'
    }, event.threadID, event.messageID);
    
    setReaction(api, ':admission_tickets:', event.messageID);
  }
};

async function setReaction(api, reaction, messageID) {
  api.setMessageReaction(reaction, messageID, (err) => {
    if (err) console.error('Filed Set Reaction', err);
  });
}