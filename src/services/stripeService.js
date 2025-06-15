import stripe from '../config/stripe.js';
import Training from '../models/Training.js';
import User from '../models/User.js';
import { createBooking } from './bookingService.js';

export const createStripeSession = async (priceId, userId, trainingId) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    mode: 'payment',
    success_url: `${process.env.CLIENT_URL}/success`,
    cancel_url: `${process.env.CLIENT_URL}/cancel`,
    metadata: { userId, trainingId },
  });
  return session;
};

export const verifyStripeEvent = (req) => {
  const signature = req.headers['stripe-signature'];
  return stripe.webhooks.constructEvent(
    req.body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET
  );
};

export const createBookingAfterPayment = async (userId, trainingId) => {
  const user = await User.findById(userId);
  const training = await Training.findById(trainingId);

  if (!user || !training) throw new Error('User or training not found');

  return await createBooking(user, training);
};
