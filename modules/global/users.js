const mongoose = require('mongoose');
const logger = require('../system/logger');

// تعريف مخطط طلب الصداقة
const friendRequestSchema = new mongoose.Schema({
  ids: String,
  senderId: { type: String, ref: 'User' },
  receiverId: { type: String, ref: 'User' },
  status: { type: String, enum: ['pending', 'accepted'], default: 'pending' }
});

// نموذج طلب الصداقة
const FriendRequest = mongoose.model('FriendRequest', friendRequestSchema);

// تعريف مخطط المستخدم
const userSchema = new mongoose.Schema({
  userName: String,
  id: String,
  isAdmin: { type: Boolean, default: false },
  name: String,
  items: { type: Array, default: [] },
  money: Number,
  createdAt: String,
  transactions: Number,
  loggedIn: { type: Boolean, default: false },
  level: { type: Number, default: 1 },
  exp: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  health: { type: Number, default: 100 },
  lastGiftDate: {type: Number, default: 0},
  password: String,
  banned: { type: Boolean, default: false },
  friends: [{ type: String, ref: 'User' }],
  friendRequests: [{ type: String, ref: 'FriendRequest' }]
});

const User = mongoose.model('User', userSchema);

async function saveNewUser(newUser) {
  try {
    const user = new User(newUser);
    await user.save();
    logger.custom('New user saved successfully', 'NEW USER');
    return user;
  } catch (error) {
    logger.error('Error saving new user: ' + error);
    throw error;
  }
}

async function getUserDate(id) {
  try {
    const user = await User.findOne({ id }).populate('friends').populate('friendRequests');
    if (!user) {
      logger.warn(`User with ID ${id} not found`);
    }
    return user;
  } catch (error) {
    logger.error(error);
    return null;
  }
}

async function deleteUserDate(id) {
  try {
    const deletedUser = await User.findOneAndDelete({ id });
    if (!deletedUser) {
      throw new Error(`User with ID ${id} not found`);
    }
    logger.custom('User deleted successfully', 'Deleted User');
  } catch (error) {
    logger.error('Error deleting user:', error);
    throw error;
  }
}

async function updateUserDate(id, updatedData) {
  try {
    const user = await User.findOneAndUpdate({ id }, updatedData, { new: true });
    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }
    logger.custom('User updated successfully', 'UPdated User');
    return user;
  } catch (error) {
    logger.error('Error updating user:', error);
    throw error;
  }
}

async function sendFriendRequest(senderId, receiverId, ids) {
  try {
    const existingRequest = await FriendRequest.findOne({
      ids,
      senderId,
      receiverId,
      status: { $in: ['pending', 'accepted'] }
    });

    if (existingRequest) {
      throw new Error('Friend request already sent or accepted');
    }

    const newRequest = await FriendRequest.create({
      ids,
      senderId,
      receiverId,
      status: 'pending'
    });

    const receiverUser = await User.findOne({ ids: ids});
    if (!receiverUser) {
      throw new Error('Receiver user not found');
    }

    if (!receiverUser.friendRequests) {
      receiverUser.friendRequests = [];
    }
    receiverUser.friendRequests.push(newRequest);
    await receiverUser.save();

    logger.system('Friend request sent successfully');
  } catch (error) {
    logger.error('Error sending friend request:', error);
    throw error;
  }
}

async function acceptFriendRequest(ids) {
  try {
    const friendRequest = await FriendRequest.findOne({ ids: ids });

    if (!friendRequest) {
      throw new Error('Friend request not found');
    }

    friendRequest.status = 'accepted';
    await friendRequest.save();

    const senderUser = await User.findOne({ id: friendRequest.senderId });
    const receiverUser = await User.findOne({ id: friendRequest.receiverId });

    if (!senderUser || !receiverUser) {
      throw new Error('User not found');
    }

    if (!senderUser.friends.includes(receiverUser.id)) {
      senderUser.friends.push(receiverUser.id);
    }

    if (!receiverUser.friends.includes(senderUser.id)) {
      receiverUser.friends.push(senderUser.id);
    }

    await senderUser.save();
    await receiverUser.save();

    logger.system('Friend request accepted successfully');
  } catch (error) {
    logger.error('Error accepting friend request:', error);
    throw error;
  }
}

async function getAllUsers() {
  try {
    const users = await User.find().populate('friends').populate('friendRequests');
    return users
  } catch (error) {
    logger.error('Error fetching all users: ' + error);
    throw error;
  }
}

module.exports = {
  getUserDate,
  updateUserDate,
  deleteUserDate,
  sendFriendRequest,
  acceptFriendRequest,
  saveNewUser,
  getAllUsers
};
