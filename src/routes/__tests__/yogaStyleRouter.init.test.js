import request from 'supertest';
import { app } from '../../../server.js';
import YogaStyle from '../../models/YogaStyle.js';
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
  });
});
