const mongoose = require('mongoose');
const log = require('../global/logger');

const storeSchema = new mongoose.Schema({
  name: String,
  type: { type: String, default: '' },
  url: { type: String, default: '' },
  info: { type: String, default: '' },
  prize: Number,
  owner: {type: String, default: '100083602650172'}
});

const Store = mongoose.model('Store', storeSchema);

async function getItem(name) {
  try {
    const ware = await Store.findOne({ name });
    if (!ware) {
      log.warn(`Ware with name ${name} is not defined`);
    }
    return ware;
  } catch (e) {
    log.error(e);
    return null;
  }
}

async function saveItem(newWare) {
  try {
    const ware = new Store(newWare);
    await ware.save();
    log.aya('New ware added to the store!');
  } catch (e) {
    log.error(e);
  }
}

async function deleteIteam(name) {
  try {
    const deletedWare = await Store.findOneAndDelete({ name });
    if (!deletedWare) {
      log.error('Error in deleting ware!');
    }
  } catch (e) {
    logger.error(e);
  }
}

async function updateItem(name, update) {
  try {
    const ware = await Store.findOneAndUpdate({ name }, update, { new: true });
    if (!ware) {
      throw new Error(`Ware with name ${name} not found`);
    }
    log.aya('Ware updated successfully');
    return ware;
  } catch (error) {
    log.error('Error updating ware: ' + error);
    throw error;
  }
}

async function getAllItems() {
  try {
    const ware = await Store.find();
    return ware;
  } catch (e) {
    log.error(e);
    return [];
  }
}

module.exports = {
  getItem,
  saveItem,
  deleteItem,
  updateItem,
  getAllItems 
};