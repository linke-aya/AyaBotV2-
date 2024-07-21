const mongoose = require('mongoose');
const log = require('../global/logger');

const replySc = new mongoose.Schema({
      body: String,
      Answer: String
    })


    const Reply = mongoose.model('Reply', replySc);

    async function getReply(body) {
      try {
        const reply = await Reply.findOne({ body });
        if (!bodyR) {
          log.info(`Reply Not Found `);
        }
        return reply;
      } catch (e) {
        log.error(e);
        return null;
      }
    }


    async function saveReply(newBody) {
      try {
        const reply = new Reply(newBody);
        await Reply.save();
        log.info('New Reply added !');
      } catch (e) {
        log.error(e);
      }
    }


    async function deleteReply(body) {
      try {
        const deleteBody = await Reply.findOneAndDelete({ body });
        if (!deleteBody) {
          log.error('Error in deleting Reply!');
        }
      } catch (e) {
        log.error(e);
      }
    }

    async function updateReply(body, update) {
      try {
        const reply = await Reply.findOneAndUpdate({ body }, update, { new: true });
        if (!reply) {
          throw new Error(`Reply with name ${name} not found`);
        }
        log.aya('Reply updated successfully');
        return reply;
      } catch (error) {
        log.error('Error updating Reply: ' + error);
        throw error;
      }
    }

    async function getAllReplys() {
      try {
        const replys = await Reply.find();
        return replys;
      } catch (e) {
        log.error(e);
        return [];
      }
    }



    module.exports = {
      getReply,
      saveReply,
      deleteReply,
      updateReply,
      getAllReplys
    };