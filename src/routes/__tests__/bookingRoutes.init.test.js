import request from 'supertest';
import { app } from '../../../server.js';
import Booking from '../../models/Booking.js';
import {
  clearTestDB,
  connectTestDB,
  disconnectTestDB,
} from '../../services/__tests__/setupTestDB.js';
import Training from '../../models/Training.js';
import YogaStyle from '../../models/YogaStyle.js';
import Trainer from '../../models/Trainer.js';
import Subscription from '../../models/Subscription.js';
import Plan from '../../models/Plan.js';
import User from '../../models/User.js';

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
  subscription = await Subscription.create({
    user: userId,
    type: plan._id,
    remainingTrainings: 5,
    status: 'active',
  });
});
afterAll(async () => {
  await disconnectTestDB();
});

describe('POST/booking/training', () => {
  test('should create training for specific user with subscription', async () => {
    const style = await YogaStyle.create({
      title: 'Hatha Yoga',
      image: 'https://example.com/hatha.jpg',
      duration: 60,
      description: 'A gentle introduction to basic yoga postures.',
      trainer: 'Alice Smith',
    });
    const trainer = await Trainer.create({
      fullName: 'Alice Smith',
      experience: 7,
      specialization: 'Hatha Yoga',
      about:
        'Certified Hatha Yoga instructor with a calm and encouraging approach.',
      photo: 'alice-smith.jpg',
    });
    const training = await Training.create({
      datetime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      spots_taken: 0,
      spots_total: 10,
      trainer_id: trainer._id,
      yogaStyle_id: style._id,
      price: 25,
      priceId: 'price_test_123',
      duration: 60,
    });

    const res = await request(app)
      .post('/booking/training')
      .set('Cookie', cookie)
      .send({ productId: training._id, type: 'training' });

    expect(res.statusCode).toBe(201);
  });
});
describe('PATCH/booking/training/cancel', () => {
  test('should cancel user booking', async () => {
    const style = await YogaStyle.create({
      title: 'Hatha Yoga',
      image: 'https://example.com/hatha.jpg',
      duration: 60,
      description: 'A gentle introduction to basic yoga postures.',
      trainer: 'Alice Smith',
    });
    const trainer = await Trainer.create({
      fullName: 'Alice Smith',
      experience: 7,
      specialization: 'Hatha Yoga',
      about:
        'Certified Hatha Yoga instructor with a calm and encouraging approach.',
      photo: 'alice-smith.jpg',
    });
    const training = await Training.create({
      datetime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      spots_taken: 0,
      spots_total: 10,
      trainer_id: trainer._id,
      yogaStyle_id: style._id,
      price: 25,
      priceId: 'price_test_123',
      duration: 60,
    });
    await request(app)
      .post('/booking/training')
      .set('Cookie', cookie)
      .send({ productId: training._id, type: 'training' });
    const booking = await Booking.find({ user: userId });
    console.log(booking);
    const res = await request(app)
      .patch('/booking/training/cancel')
      .set('Cookie', cookie)
      .send({ bookingId: booking[0]._id, trainingId: training._id });
    expect(res.statusCode).toBe(200);
  });
});

describe('GET/booking/trainings', () => {
  test('should return arr of users booking', async () => {
    const style = await YogaStyle.create({
      title: 'Hatha Yoga',
      image: 'https://example.com/hatha.jpg',
      duration: 60,
      description: 'A gentle introduction to basic yoga postures.',
      trainer: 'Alice Smith',
    });
    const trainer = await Trainer.create({
      fullName: 'Alice Smith',
      experience: 7,
      specialization: 'Hatha Yoga',
      about:
        'Certified Hatha Yoga instructor with a calm and encouraging approach.',
      photo: 'alice-smith.jpg',
    });
    const training = await Training.create({
      datetime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      spots_taken: 0,
      spots_total: 10,
      trainer_id: trainer._id,
      yogaStyle_id: style._id,
      price: 25,
      priceId: 'price_test_123',
      duration: 60,
    });
    await request(app)
      .post('/booking/training')
      .set('Cookie', cookie)
      .send({ productId: training._id, type: 'training' });

    const res = await request(app)
      .get('/booking/trainings')
      .set('Cookie', cookie);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(1);
  });
});
