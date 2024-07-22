const mongoose = require('mongoose');
const log = require('../global/logger');

const bankSchema = new mongoose.Schema({
  name: String,
  users: [{ type: String, ref: 'User' }], // قائمة المستخدمين
  money: { type: Number, default: 0 },
  info: { type: String, default: 'نحن دوماً في خدمتكم.' },
  createdAt: String,
  owner: String
});
const Bank = mongoose.model('Bank', bankSchema);

async function makeBank(newBank) {
  try {
    const bank = new Bank(newBank);
    await bank.save();
    log.aya('New Bank In Game');
  } catch (e) {
    log.error(e);
    throw e;
  }
}

async function findBank(name) {
  try {
    return await Bank.findOne({ name });
  } catch (e) {
    log.error(e);
    throw e;
  }
}

async function updateBank(name, updateData) {
  try {
    const bank = await Bank.findOneAndUpdate({ name }, updateData, { new: true });
    if (!bank) throw new Error(`Bank with Name ${name} not found`);
    log.aya('Bank updated successfully');
    return bank;
  } catch (error) {
    log.error('Error updating bank: ' + error);
    throw error;
  }
}

async function deleteBank(name) {
  try {
    const result = await Bank.findOneAndDelete({ name });
    if (!result) throw new Error(`Bank with Name ${name} not found`);
    log.aya('Bank deleted successfully');
  } catch (error) {
    log.error('Error deleting bank: ' + error);
    throw error;
  }
}

async function getBanks() {
  try {
    return await Bank.find();
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
};