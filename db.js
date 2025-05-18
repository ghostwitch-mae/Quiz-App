const mongoose = require('mongoose');

// MongoDB connection URI - replace with your actual connection string
const MONGODB_URI = 'mongodb+srv://ghostwitch:Maysoon1!@project3.dxsrcye.mongodb.net/?retryWrites=true&w=majority&appName=project3';

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;