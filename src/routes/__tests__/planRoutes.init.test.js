import request from 'supertest';
import { app } from '../../../server.js';
import Plan from '../../models/Plan.js';
import {
  clearTestDB,
  connectTestDB,
  disconnectTestDB,
} from '../../services/__tests__/setupTestDB.js';
import mongoose from 'mongoose';

beforeAll(async () => {
  await connectTestDB();
});

afterEach(async () => {
  await clearTestDB();
});

afterAll(async () => {
  await disconnectTestDB();
});

describe('GET/plans/all', () => {
  test('should return full list of plans from DB', async () => {
    await Plan.create(
      {
        type: 'pack',
        title: '5-Class Pack',
        price: 60,
        priceId: 'price_5_pack',
        description: 'Access to 5 yoga classes within 3 months.',
        trainingsCount: 5,
      },
      {
        type: 'pack',
        title: '10-Class Pack',
        price: 110,
        priceId: 'price_10_pack',
        description:
          '10-class pass with flexibility to attend anytime within 6 months.',
        trainingsCount: 10,
      },
      {
        type: 'unlimited',
        title: '1-Month Unlimited',
        price: 80,
        priceId: 'price_unlimited_1m',
        description: 'Unlimited access to all classes for one month.',
        durationInMonths: 1,
      },
      {
        type: 'unlimited',
        title: '3-Month Unlimited',
        price: 210,
        priceId: 'price_unlimited_3m',
        description: 'Unlimited access to all classes for three months.',
        durationInMonths: 3,
      }
    );
    const res = await request(app).get('/plans/all');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(4);
  });
});
describe('GET/plans/:id', () => {
  test('should return plan by id', async () => {
    const plan = await Plan.create({
      type: 'pack',
      title: '5-Class Pack',
      price: 60,
      priceId: 'price_5_pack',
      description: 'Access to 5 yoga classes within 3 months.',
      trainingsCount: 5,
    });

    const res = await request(app).get(`/plans/all/${plan._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(String(plan._id));
  });
  test('should return 404 if there is no such plan', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/plans/all/${nonExistentId}`);
    expect(res.statusCode).toBe(404);
  });
});
