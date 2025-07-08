import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { app } from '../../../server.js';
import YogaStyle from '../../models/YogaStyle.js';

let mongoServer;

beforeAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});
afterEach(async () => {
  await YogaStyle.deleteMany();
});
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('GET/yoga/styles', () => {
  test('returns all yoga styles', async () => {
    await YogaStyle.create([
      {
        title: 'Hatha Yoga',
        image: 'https://example.com/hatha.jpg',
        duration: 60,
        description: 'A gentle introduction to basic yoga postures.',
        trainer: 'Alice Smith',
      },
      {
        title: 'Vinyasa Flow',
        image: 'https://example.com/vinyasa.jpg',
        duration: 45,
        description: 'A dynamic sequence of poses.',
        trainer: 'Bob Johnson',
      },
    ]);

    const res = await request(app).get('/yoga/styles');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);
    expect(res.body[0].title).toBe('Hatha Yoga');
  });
});
