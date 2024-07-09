const mongoose = require('mongoose');
const logger = require('../system/logger');

// تعريف مخطط المجموعة
const groupSchema = new mongoose.Schema({
  id: String,
  prefix: { type: String, default: '.' },
  name: String,
  img: { type: String, default: '' },
  messageCount: { type: Number, default: 0 },
  creationTime: { type: String, default: ''},
  members: { type: Array, default: [] },
  settings: { type: Object, default: {} },
  data: { type: Object, default: {} },
  admins: { type: Array, default: []}, // قائمة بمعرفات أدمن المجموعة
  status: { type: Boolean, default: false } // حالة القبول (القيمة الافتراضية خطأ)
});

// نموذج المجموعة
const Group = mongoose.model('Group', groupSchema);

// حفظ مجموعة جديدة
async function saveNewGroup(newGroup) {
  try {
    const group = new Group(newGroup);
    await group.save();
    logger.custom(`New group saved successfully with ID ${newGroup.id}`, 'New Group');
    return group;
  } catch (error) {
    logger.error(`Error saving new group with ID ${newGroup.id}:`, error);
    throw error;
  }
}

// الحصول على بيانات المجموعة بواسطة الأيدي
async function getGroupData(id) {
  try {
    const group = await Group.findOne({ id }).populate('admins');
    if (!group) {
      logger.warn(`Group with ID ${id} not found`);
      return null
    }
    return group;
  } catch (error) {
    logger.error(`Error fetching group data for ID ${id}:` + error);
    return null;
  }
}

// حذف مجموعة
async function deleteGroupData(id) {
  try {
    const deletedGroup = await Group.findOneAndDelete({ id });
    if (!deletedGroup) {
      throw new Error(`Group with ID ${id} not found`);
    }
    logger.custom(`Group with ID ${id} deleted successfully`, 'Delete Group');
  } catch (error) {
    logger.error(`Error deleting group with ID ${id}:`, error);
    throw error;
  }
}

// تحديث بيانات المجموعة
async function updateGroupData(id, updatedData) {
  try {
    const group = await Group.findOneAndUpdate({ id }, updatedData, { new: true });
    if (!group) {
      throw new Error(`Group with ID ${id} not found`);
    }
    logger.custom(`Group with ID ${id} updated successfully`, 'UPdeted Group');
    return group;
  } catch (error) {
    logger.error(`Error updating group with ID ${id}:`, error);
    throw error;
  }
}

// إضافة أدمن إلى المجموعة
async function addAdminToGroup(groupId, adminId) {
  try {
    const group = await Group.findOne({ id: groupId });
    if (!group) {
      throw new Error('Group not found');
    }

    group.admins.push(adminId);
    await group.save();

    logger.info(`Admin with ID ${adminId} added to group with ID ${groupId} successfully`);
  } catch (error) {
    logger.error(`Error adding admin with ID ${adminId} to group with ID ${groupId}:`, error);
    throw error;
  }
}

// قبول المجموعة
async function acceptGroup(groupId) {
  try {
    const group = await Group.findOne({ id: groupId });
    if (!group) {
      throw new Error('Group not found');
    }

    group.status = true;
    await group.save();

    logger.info(`Group with ID ${groupId} accepted successfully`);
  } catch (error) {
    logger.error(`Error accepting group with ID ${groupId}:`, error);
    throw error;
  }
}

async function addMemberToGroup(memberID, groupID) {
  try {
    const group = await Group.findOne({ id: groupID });
    if (!group) {
      throw new Error(`Group with ID ${groupID} not found`);
    }

    group.members.push(memberID); // يجب أن يكون push بدلاً من التعيين المباشر
    await group.save();
    logger.info(`Member with ID ${memberID} added to group with ID ${groupID} successfully`);
  } catch (error) {
    logger.error(`Error adding member with ID ${memberID} to group with ID ${groupID}:`, error);
    throw error;
  }
}
async function getAllGroups() {
  try {
    const groups = await Group.find();
    return groups;
  } catch (error) {
    logger.error('Error fetching all Groups: ' + error);
    throw error;
  }
}

module.exports = {
  saveNewGroup,
  getGroupData,
  deleteGroupData,
  updateGroupData,
  addAdminToGroup,
  acceptGroup,
  getAllGroups 
}