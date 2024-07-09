const mongoose = require('mongoose');
const logger = require('../system/logger');



const storeSchema = new mongoose.Schema({
  name: String,
  type: { type: String, default: '' },
  url: { type: String, default: '' },
  info: { type: String, default: '' },
  prize: Number,
  discount: { type: Number, default: 0 },
  owner: {type: String, default: '100083602650172'}
});

const Store = mongoose.model('Store', storeSchema);

async function getWareData(name) {
  try {
    const ware = await Store.findOne({ name });
    if (!ware) {
      logger.info(`Ware with name ${name} is not defined`);
    }
    return ware;
  } catch (e) {
    logger.error(e);
    return null;
  }
}

async function saveNewWare(newWare) {
  try {
    const ware = new Store(newWare);
    await ware.save();
    logger.info('New ware added to the store!');
  } catch (e) {
    logger.error(e);
  }
}

async function deleteWare(name) {
  try {
    const deletedWare = await Store.findOneAndDelete({ name });
    if (!deletedWare) {
      logger.error('Error in deleting ware!');
    }
  } catch (e) {
    logger.error(e);
  }
}

async function updateWare(name, update) {
  try {
    const ware = await Store.findOneAndUpdate({ name }, update, { new: true });
    if (!ware) {
      throw new Error(`Ware with name ${name} not found`);
    }
    logger.info('Ware updated successfully');
    return ware;
  } catch (error) {
    logger.error('Error updating ware: ' + error);
    throw error;
  }
}

async function getAllWare(variable) {
  try {
    const ware = await Store.find(variable);
    console.log(typeof ware)
    return ware;
  } catch (e) {
    logger.error(e);
    return [];
  }
}

module.exports = {
  getWareData,
  saveNewWare,
  deleteWare,
  updateWare,
  getAllWare
};