import { createBookingAfterPayment } from '../services/bookingService.js';
import * as stripeService from '../services/stripeService.js';
import { createSubscriptionAfterPayment } from '../services/subscriptionService.js';

export const handleStripeWebhook = async (req, res) => {
  try {
    const event = stripeService.verifyStripeEvent(req);
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const { userId, productId, type } = session.metadata;
      if (type === 'training') {
        await createBookingAfterPayment(userId, productId);
      } else if (type === 'subscription') {
        await createSubscriptionAfterPayment(userId, productId);
      }
    }
    res.status(200).json({ received: true });
  } catch (err) {
    console.error('Webhook error:', err);
    res.status(400).send(`Webhook error: ${err.message}`);
  }
};
