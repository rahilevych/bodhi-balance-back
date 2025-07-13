import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { app } from '../../../server.js';
import Training from '../../models/Training.js';
import {
  clearTestDB,
  connectTestDB,
  disconnectTestDB,
} from '../../services/__tests__/setupTestDB.js';
import Trainer from '../../models/Trainer.js';
import YogaStyle from '../../models/YogaStyle.js';

let mongoServer;

beforeAll(async () => {
  await connectTestDB();
});
afterEach(async () => {
  await clearTestDB();
});
afterAll(async () => {
  await disconnectTestDB();
});

describe('GET/trainings', () => {
  test('should return list of all trainings from DB', async () => {
    const trainer = await Trainer.create({
      fullName: 'Sophia Bennett',
      experience: 8,
      specialization: 'Yin Yoga',
      about: 'Certified yoga therapist focused on body-mind connection.',
      photo: 'sophia.jpg',
    });
    const style = await YogaStyle.create({
      title: 'Yin Yoga',
      image: 'yin.jpg',
      duration: 75,
      description: 'A slow-paced style of yoga with deep stretching.',
      trainer: 'Sophia Bennett',
    });
    const date = new Date();
    const training = await Training.create({
      datetime: date,
      trainer_id: trainer._id,
      yogaStyle_id: style._id,
      spots_taken: 3,
      spots_total: 10,
      price: 20,
      priceId: 'price_123',
      duration: 75,
    });
    const res = await request(app).get(`/schedule/trainings?date=${date}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].trainer_id.fullName).toBe('Sophia Bennett');
    expect(res.body[0].spots_taken).toBe(3);
    expect(res.body[0].spots_total).toBe(10);
  });

  test('should return taining by id ', async () => {
    const trainer = await Trainer.create({
      fullName: 'James Lee',
      experience: 6,
      specialization: 'Power Yoga',
      about: 'Focused on strength and endurance.',
      photo: 'james.jpg',
    });

    const yogaStyle = await YogaStyle.create({
      title: 'Power Yoga',
      image: 'power.jpg',
      duration: 60,
      description: 'A vigorous fitness-based approach to vinyasa-style yoga.',
      trainer: 'James Lee',
    });

    const training = await Training.create({
      datetime: new Date('2025-07-13T14:00:00Z'),
      trainer_id: trainer._id,
      yogaStyle_id: yogaStyle._id,
      spots_taken: 5,
      spots_total: 12,
      price: 25,
      priceId: 'price_456',
      duration: 60,
    });
    const res = await request(app).get(
      `/schedule/trainings/training/${training._id}`
    );
    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(String(training._id));
    expect(res.body.trainer_id.fullName).toBe('James Lee');
    expect(res.body.yogaStyle_id.title).toBe('Power Yoga');
  });
});
