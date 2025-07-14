import request from 'supertest';
import { app } from '../../../server.js';
import Question from '../../models/Question.js';
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
describe('GET/questions/all', () => {
  test('should return full list of questions from DB', async () => {
    await Question.create([
      {
        question: 'What should I bring to a yoga class?',
        answer:
          'We recommend bringing a yoga mat, a bottle of water, and comfortable clothing.',
      },
      {
        question: 'Can beginners join the classes?',
        answer:
          'Absolutely! Our classes are suitable for all levels, including complete beginners.',
      },
      {
        question: 'Do I need to book a spot in advance?',
        answer: 'Yes, booking in advance is recommended as spots are limited.',
      },
      {
        question: 'What types of yoga styles do you offer?',
        answer: 'We offer Hatha, Vinyasa, Yin, Ashtanga, and Power Yoga.',
      },
      {
        question: 'How long is each yoga session?',
        answer:
          'Each session typically lasts 60 minutes unless otherwise specified.',
      },
    ]);
    const res = await request(app).get('/questions/all');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(5);
  });
});
