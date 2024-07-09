// database.js
const mongoose = require('mongoose');
const logger = require('../modules/system/logger');const config= require('../config/config')

const uri = "mongodb+srv://ahmdaltwm516:gH4RktEcDJDGSmkX@cluster0.d9heedq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const connectDB = async () => {
  try {
    await mongoose.connect(uri);
    logger.system('Connected to MongoDB');
  } catch (error) {
    logger.error(error);
    
  }
};

module.exports = { connectDB };