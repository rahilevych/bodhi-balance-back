import request from 'supertest';
import { app } from '../../../server.js';
import User from '../../models/User.js';
import {
  clearTestDB,
  connectTestDB,
  disconnectTestDB,
} from '../../services/__tests__/setupTestDB.js';

beforeAll(async () => {
  await connectTestDB();
});

afterEach(async () => {
  await clearTestDB();
});
afterAll(async () => {
  await disconnectTestDB();
});
const userData = {
  email: 'testuser@gmail.com',
  password: '1111111',
  name: 'User name',
};

describe('POST/auth/register', () => {
  test('should register new user', async () => {
    const res = await request(app).post('/auth/register').send(userData);
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('Registration successful');
    expect(res.body.user.user.name).toBe('User name');
    expect(res.body.user.user.email).toBe('testuser@gmail.com');
  });
  test('should return err 400 if user already exists', async () => {
    await User.create(userData);
    const res = await request(app).post('/auth/register').send(userData);
    expect(res.statusCode).toBe(400);
  });
});

describe('POST/auth/login', () => {
  test('should login user if such user exists', async () => {
    await request(app).post('/auth/register').send(userData);
    const res = await request(app)
      .post('/auth/login')
      .send({ email: userData.email, password: userData.password });
    expect(res.statusCode).toBe(200);
  });
  test('should return err if credentials are invalid', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'wrong@example.com', password: 'nopassword' });
    expect(res.statusCode).toBe(401);
  });
});

describe('GET/me', () => {
  test('should verify if user logged in and token from cookies were gotten', async () => {
    await request(app).post('/auth/register').send(userData);
    const loginRes = await request(app)
      .post('/auth/login')
      .send({ email: userData.email, password: userData.password });
    const cookies = loginRes.headers['set-cookie'];
    const res = await request(app).get('/auth/me').set('Cookie', cookies);
    expect(res.statusCode).toBe(200);
  });
  test('should return err if there is no token', async () => {
    await request(app).post('/auth/register').send(userData);
    await request(app)
      .post('/auth/login')
      .send({ email: userData.email, password: userData.password });

    const res = await request(app).get('/auth/me');
    expect(res.statusCode).toBe(401);
  });
});
