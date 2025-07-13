import request from 'supertest';
import { app } from '../../../server.js';
import Trainer from '../../models/Trainer.js';
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
describe('GET/trainers/all', () => {
  test('should return full list of trainers from DB', async () => {
    await Trainer.create([
      {
        fullName: 'Alice Smith',
        experience: 7,
        specialization: 'Hatha Yoga',
        about:
          'Certified Hatha Yoga instructor with a calm and encouraging approach.',
        photo: 'alice-smith.jpg',
      },
      {
        fullName: 'Ben Johnson',
        experience: 5,
        specialization: 'Vinyasa Flow',
        about: 'Energetic trainer focused on breath and movement connection.',
        photo: 'ben-johnson.jpg',
      },
      {
        fullName: 'Carla Liu',
        experience: 10,
        specialization: 'Yin Yoga',
        about:
          'Deeply knowledgeable in restorative techniques for stress relief.',
        photo: 'carla-liu.jpg',
      },
      {
        fullName: 'David Kim',
        experience: 3,
        specialization: 'Power Yoga',
        about: 'Fitness-oriented yoga with strength and flexibility.',
        photo: 'david-kim.jpg',
      },
      {
        fullName: 'Ella Rodriguez',
        experience: 6,
        specialization: 'Ashtanga Yoga',
        about: 'Focus on discipline and sequence-based practice.',
        photo: 'ella-rodriguez.jpg',
      },
    ]);
    const res = await request(app).get('/trainers/all');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(5);
  });
});
