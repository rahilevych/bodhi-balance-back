import stripe from '../../config/stripe.js';
import { createStripeSession, verifyStripeEvent } from '../stripeService.js';

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

describe('stripeService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createStripeSession', () => {
    test('creates a stripe session with given parameters', async () => {
      const mockSession = { id: 'sess_123' };
      stripe.checkout.sessions.create.mockResolvedValue(mockSession);

      const priceId = 'price_abc';
      const userId = 'user_123';
      const productId = 'prod_456';
      const type = 'subscription';

      process.env.CLIENT_URL = 'https://example.com';

      const result = await createStripeSession(
        priceId,
        userId,
        productId,
        type
      );

      expect(stripe.checkout.sessions.create).toHaveBeenCalledWith({
        payment_method_types: ['card'],
        line_items: [{ price: priceId, quantity: 1 }],
        mode: 'payment',
        success_url: 'https://example.com/success',
        cancel_url: 'https://example.com/cancel',
        metadata: { userId, productId, type },
      });

      expect(result).toEqual(mockSession);
    });
  });

  describe('verifyStripeEvent', () => {
    test('verifies and return stripe event', () => {
      const mockEvent = { id: 'evt_123' };
      const mockReq = {
        body: 'fake_raw_body',
        headers: {
          'stripe-signature': 'fake_signature',
        },
      };
      process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test';

      stripe.webhooks.constructEvent.mockReturnValue(mockEvent);

      const result = verifyStripeEvent(mockReq);

      expect(stripe.webhooks.constructEvent).toHaveBeenCalledWith(
        'fake_raw_body',
        'fake_signature',
        'whsec_test'
      );

      expect(result).toEqual(mockEvent);
    });
  });
});
