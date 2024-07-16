const startBot = require('./system/login')
const log = require('./global/logger')
const mongoose = require('mongoose');
require('dotenv').config()
const uri = process.env.DB_MONGOOSE
module.exports =  async () => {
log.on()
  try {
    await mongoose.connect(uri);
    log.system('Connected to MongoDB');
  } catch (error) {
    log.error(error);
    
  }

startBot()

}