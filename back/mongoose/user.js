const mongoose = require('mongoose');
const log = require('../global/logger');


const userSchema = new mongoose.Schema({
  userName: {type: String, default: ''},
  img: { type: String, default: '' },
  name: { type: String },
  id: { type: String },
  bank: { type: String, ref: 'Bank', default: null },
  password: String,
  money: {type: Number, default: 0},
  createdAt: String,
  exp: { type: Number, default: 0 },
  rank: String,
  isAdmin: { type: Boolean, default: false },
  friends: { type: Array, default: [] },
  friendsP: { type: Array, default: [] },
  items: { type: Array, default: [] },
  bankAccuunt: { type: Boolean, default: false },
  haveAccuunt: { type: Boolean, default: false },
  info: { type: String, default: 'مرحبا انا استعمل اية' }
  
})
const User = mongoose.model('User', userSchema);

async function saveUser(newUser) {
  try {
    const user = new User(newUser);
    await user.save();
    log.aya('New user saved successfully');
    return user;
  } catch (error) {
    log.error('Error saving new user: ' + error);
    throw error;
  }
}

async function getUser(id) {
  try {
    const user = await User.findOne({ id })
    if (!user) {
      log.warn(`User with ID ${id} not found`);
    }
    return user;
  } catch (error) {
    logger.error(error);
    return null;
  }
}

async function deleteUser(id) {
  try {
    const deletedUser = await User.findOneAndDelete({ id });
    if (!deletedUser) {
      throw new Error(`User with ID ${id} not found`);
    }
    log.aya('User deleted successfully');
  } catch (error) {
    log.error('Error deleting user:' + error);
    throw error;
  }
}

async function updateUser(id, updatedData) {
  try {
    const user = await User.findOneAndUpdate({ id }, updatedData, { new: true });
    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }
    log.aya('User updated successfully');
    return user;
  } catch (error) {
    log.error('Error updating user:' + error);
    throw error;
  }
}

async function getAllUsers() {
  try {
    const users = await User.find()
    return users
  } catch (error) {
    log.error('Error fetching all users: ' + error);
    throw error;
  }
}


module.exports = {
  getUser,
  updateUser,
  deleteUser,
  saveUser,
  getAllUsers
};

