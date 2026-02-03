const mongoose = require('mongoose');

const connectDb = async () => {
  try {
    const url = process.env.MONGODB_URI;
    await mongoose.connect(url);
    console.log('>>> MongoDB connected successfully');
  } catch (error) {
    console.error('>>> MongoDB connection failed:', error);
    process.exit(1);
  }
}

module.exports = {
  connectDb
}