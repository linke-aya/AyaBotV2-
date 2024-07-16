const mongoose = require('mongoose');
const log = require('../global/logger');


const groupSchema = new mongoose.Schema({
  id: String,
  prefix: { type: String, default: '.' },
  name: String,
  img: { type: String, default: '' },
  messageCount: { type: Number, default: 0 },
  members: { type: Array, default: [] },
  settings: { type: Object, default: {} },
  data: { type: Object, default: {} },
  admins: { type: Array, default: []}, 
  status: { type: Boolean, default: false },
  helpList: { type: Number, default: 1 }
});

// نموذج المجموعة
const Group = mongoose.model('Group', groupSchema);


async function saveGroup(newGroup) {
  try {
    const group = new Group(newGroup);
    await group.save();
    log.aya(`New group saved successfully with ID ${newGroup.id}`);
    return group;
  } catch (error) {
    log.error(`Error saving new group with ID ${newGroup.id}:` + error);
    throw error;
  }
}



async function getGroup(id) {
  try {
    const group = await Group.findOne({ id })
    if (!group) {
      log.warn(`Group with ID ${id} not found`);
      return null
    }
    return group;
  } catch (error) {
    log.error(`Error fetching group data for ID ${id}:` + error);
    return null;
  }
}


async function deleteGroup(id) {
  try {
    const deletedGroup = await Group.findOneAndDelete({ id });
    if (!deletedGroup) {
      throw new Error(`Group with ID ${id} not found`);
    }
    log.aya(`Group with ID ${id} deleted successfully`);
  } catch (error) {
    log.error(`Error deleting group with ID ${id}:` + error);
    throw error;
  }
}



async function updateGroup(id, updatedData) {
  try {
    const group = await Group.findOneAndUpdate({ id }, updatedData, { new: true });
    if (!group) {
      throw new Error(`Group with ID ${id} not found`);
    }
    log.aya(`Group with ID ${id} updated successfully`);
    return group;
  } catch (error) {
    log.error(`Error updating group with ID ${id}:` + error);
    throw error;
  }
}


async function acceptGroup(groupId) {
  try {
    const group = await Group.findOne({ id: groupId });
    if (!group) {
      throw new Error('Group not found');
    }

    group.status = true;
    await group.save();

    log.aya(`Group with ID ${groupId} accepted successfully`);
  } catch (error) {
    log.error(`Error accepting group with ID ${groupId}:` + error);
    throw error;
  }
}

async function getAllGroups() {
  try {
    const groups = await Group.find();
    return groups;
  } catch (error) {
    log.error('Error fetching all Groups: ' + error);
    throw error;
  }
}



module.exports = {
  saveGroup,
  getGroup,
  deleteGroup,
  updateGroup,
  acceptGroup,
  getAllGroups 
}
