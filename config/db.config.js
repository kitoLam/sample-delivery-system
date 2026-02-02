const mongoose = require('mongoose');

const connectDb = async () => {
  try {
    const url = 'mongodb+srv://lameojicoemail_db_user:123@eye-wear.6dn8u2e.mongodb.net/SWP_EyeWear_DB'
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