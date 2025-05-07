import mongoose from 'mongoose';

const connectDB = async (DB_URI) => {
  try {
    await mongoose.connect(DB_URI);
    console.log('DB connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};
export default connectDB;
