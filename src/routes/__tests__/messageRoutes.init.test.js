process.env.STRIPE_KEY = 'sk_test_fake_key';
process.env.STRIPE_WEBHOOK_SECRET = 'sk_test_fake_key';
import request from 'supertest';
import { app } from '../../../server.js';
import {
  clearTestDB,
  connectTestDB,
  disconnectTestDB,
} from '../../services/__tests__/setupTestDB.js';

jest.mock('../../config/stripe.js', () => ({
  __esModule: true,
  default: {
    checkout: {
      sessions: {
        create: jest.fn(),
      },
    },
    webhooks: {
      constructEvent: jest.fn(),
    },
  },
}));

beforeAll(async () => {
  await connectTestDB();
});

afterEach(async () => {
  await clearTestDB();
});
afterAll(async () => {
  await disconnectTestDB();
});
jest.mock('../../config/mailer.js', () => ({
  createTransporter: jest.fn(() => ({
    sendMail: jest.fn().mockResolvedValue(true),
  })),
}));

describe('POST/contact/message', () => {
  test('should return status 200', async () => {
    const contactData = {
      fullName: 'User',
      email: 'user@email.com',
      message: 'Test question',
    };
    const res = await request(app).post('/contact/message').send(contactData);
    expect(res.statusCode).toBe(200);
  });
});
