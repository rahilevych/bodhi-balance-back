import request from 'supertest';
import { app } from '../../../server.js';
import User from '../../models/User.js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import {
  clearTestDB,
  connectTestDB,
  disconnectTestDB,
} from '../../services/__tests__/setupTestDB.js';
dotenv.config({ path: '.env' });

let token;
let userId;

beforeAll(async () => {
  await connectTestDB();
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
  await clearTestDB();
});
afterAll(async () => {
  await disconnectTestDB();
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
