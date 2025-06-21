import stripe from '../config/stripe.js';

export const createStripeSession = async (priceId, userId, productId, type) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    mode: 'payment',
    success_url: `${process.env.CLIENT_URL}/success`,
    cancel_url: `${process.env.CLIENT_URL}/cancel`,
    metadata: { userId, productId, type },
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
