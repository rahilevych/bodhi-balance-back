import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
let mongoServer;

export const connectTestDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
};

export const clearTestDB = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
};

export const disconnectTestDB = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
};
