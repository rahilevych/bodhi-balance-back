import request from 'supertest';
import { app } from '../../../server.js';
import {
  clearTestDB,
  connectTestDB,
  disconnectTestDB,
} from '../../services/__tests__/setupTestDB.js';
import Plan from '../../models/Plan.js';
import Subscription from '../../models/Subscription.js';
import { createStripeSession } from '../../services/stripeService.js';

jest.mock('../../services/stripeService.js');

let userData = {
  email: 'testuser@gmail.com',
  password: '1111111',
  name: 'User name',
};
let cookie;
let plan;
let subscription;
let userId;

beforeAll(async () => {
  await connectTestDB();
});

beforeEach(async () => {
  await clearTestDB();
  await request(app).post('/auth/register').send(userData);
  const loginRes = await request(app)
    .post('/auth/login')
    .send({ email: userData.email, password: userData.password });
  userId = loginRes.body._id;
  cookie = loginRes.headers['set-cookie'];

  plan = await Plan.create({
    type: 'pack',
    title: '5-Class Pack',
    price: 60,
    priceId: 'price_5_pack',
    description: 'Access to 5 yoga classes within 3 months.',
    trainingsCount: 5,
  });
});
afterAll(async () => {
  await disconnectTestDB();
});

describe('GET/subscription/active', () => {
  test('should return active users subscription', async () => {
    subscription = await Subscription.create({
      user: userId,
      type: plan._id,
      remainingTrainings: 5,
      status: 'active',
    });
    const res = await request(app)
      .get('/subscription/active')
      .set('Cookie', cookie);
    expect(res.statusCode).toBe(200);
  });
});

describe('POST/subscription/buy', () => {
  createStripeSession.mockResolvedValue({
    url: 'https://fake.stripe.com/session',
  });

  test('should return url if user successfully bought subscription', async () => {
    const res = await request(app)
      .post('/subscription/buy')
      .send({
        productId: plan._id.toString(),
        type: 'subscription',
      })
      .set('Cookie', cookie);

    expect(res.statusCode).toBe(200);
  });
});
