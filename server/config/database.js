const mongoose = require('mongoose');

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/lms-certification';

const connectDB = async () => {
  try {
    // Set connection options for better timeout handling
    const options = {
      serverSelectionTimeoutMS: 5000, // 5 seconds
      socketTimeoutMS: 45000, // 45 seconds
      connectTimeoutMS: 10000, // 10 seconds
      maxPoolSize: 10
      // Removed bufferCommands: false to allow buffering
    };

    await mongoose.connect(MONGODB_URI, options);

    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));
    db.once('open', () => {
      console.log('✅ Connected to MongoDB successfully');
    });
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    // Don't exit process in production, let the app continue
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
