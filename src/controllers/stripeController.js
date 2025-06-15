import * as stripeService from '../services/stripeService.js';

export const handleStripeWebhook = async (req, res) => {
  try {
    const event = stripeService.verifyStripeEvent(req);
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const { userId, trainingId } = session.metadata;
      await stripeService.createBookingAfterPayment(userId, trainingId);
    }

    res.status(200).json({ received: true });
  } catch (err) {
    console.error('Webhook error:', err);
    res.status(400).send(`Webhook error: ${err.message}`);
  }
};
