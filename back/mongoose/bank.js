const mongoose = require('mongoose');
const log = require('../global/logger');

const users = new mongoose.Schema({
  id: { type: String, ref: 'Bank' },
  money: { type: String, ref: 'Bank' },
  worker: { type: Boolean, default: false, ref: 'Bank' }
});
const UserBank = mongoose.model('UserBank', users);


const bankSchema = new mongoose.Schema({
   name: String,
   users: [{ type: String, ref: 'UserBank' }],
   money: { type: Number, default: 0 },
   info: { type: String, default: 'نحن دوماً في خدمتكم.'  },
   createdAt: String,
   owner: String
})
const Bank = mongoose.model('Bank', bankSchema);


async function makeBank(newBank) {
  try {
    const bank = new Bank(newBank)
    await bank.save
    log.aya('New Bank In Game')
  } catch (e) {
    log.error(e)
  }
}

async function findBank(name) {
  try {
    const bank = await Bank.findOne({ name }).populate('UserBank')
    if (!bank) {
      log.warn('This Bank Is Not Defiend')
      return null
    }
    return bank
  } catch (e) {
    log.error(e)
  }
}

async function updateBank(name, updateData) {
  try {
    const bank = await Bank.findOneAndUpdate({ name }, updatedData, { new: true });
    if (!bank) {
      throw new Error(`Bank with Name ${name} not found`);
    }
    log.aya('Bank updated successfully');
    return bank;
  } catch (error) {
    log.error('Error updating bank:' + error);
    throw error;
  }
}

async function deleteBank(name) {
  try {
    const deleteBank = await User.findOneAndDelete({ name });
    if (!deleteBank) {
      throw new Error(`Bank with Name ${name} not found`);
    }
    log.aya('Bank deleted successfully');
  } catch (error) {
    log.error('Error deleting bank:' + error);
    throw error;
  }
}

async function getBanks() {
  try {
    const banks = await Bank.find()
    return banks
  } catch (error) {
    log.error('Error fetching all banks: ' + error);
    throw error;
  }
}




module.exports = {
  makeBank,
  findBank,
  updateBank,
  deleteBank,
  getBanks
}