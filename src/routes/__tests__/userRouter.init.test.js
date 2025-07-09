import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { app } from '../../../server.js';
import User from '../../models/User.js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config({ path: '.env' });

let mongoServer;
let token;
let userId;

beforeAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

beforeEach(async () => {
  const user = await User.create({
    name: 'Test User',
    email: 'test.user@example.com',
    password: 'Test1234!',
    role: 'user',
    address: 'Berlin, Germany',
    phone: '+49 30 12345678',
    bookings: [],
  });

  userId = user._id;

  token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
});
afterEach(async () => {
  await User.deleteMany();
});
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('PUT /users/:id', () => {
  it('should update user data', async () => {
    const res = await request(app)
      .put(`/users/${userId}`)
      .set('Cookie', [`token=${token}`])
      .send({ data: { name: 'Updated Name' } })
      .expect(200);
    expect(res.body.name).toBe('Updated Name');
    const updatedUser = await User.findById(userId);
    expect(updatedUser.name).toBe('Updated Name');
  });
});

describe('DELETE /users/delete', () => {
  it('should delete the user', async () => {
    const res = await request(app)
      .delete('/users/delete')
      .set('Cookie', [`token=${token}`])
      .expect(200);
    expect(res.text).toMatch(/deleted/i);
    const deletedUser = await User.findById(userId);
    expect(deletedUser).toBeNull();
  });
});
