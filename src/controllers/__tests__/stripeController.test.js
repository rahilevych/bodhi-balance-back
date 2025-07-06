import * as stripeService from '../../services/stripeService.js';
import * as bookingService from '../../services/bookingService.js';
import * as subscriptionService from '../../services/subscriptionService.js';
import { handleStripeWebhook } from '../stripeController.js';

jest.mock('../../services/stripeService.js', () => ({
  createStripeSession: jest.fn(),
  verifyStripeEvent: jest.fn(),
}));
describe('handleStripeWebhook', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('calls createBookingAfterPayment for training type and responds 200', async () => {
    const mockEvent = {
      type: 'checkout.session.completed',
      data: {
        object: {
          metadata: {
            userId: 'user1',
            productId: 'prod1',
            type: 'training',
          },
        },
      },
    };
    jest.spyOn(stripeService, 'verifyStripeEvent').mockReturnValue(mockEvent);
    const bookingSpy = jest
      .spyOn(bookingService, 'createBookingAfterPayment')
      .mockResolvedValue();

    await handleStripeWebhook(req, res);

    expect(stripeService.verifyStripeEvent).toHaveBeenCalledWith(req);
    expect(bookingSpy).toHaveBeenCalledWith('user1', 'prod1');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ received: true });
  });

  test('calls createSubscriptionAfterPayment for subscription type and responds 200', async () => {
    const mockEvent = {
      type: 'checkout.session.completed',
      data: {
        object: {
          metadata: {
            userId: 'user2',
            productId: 'prod2',
            type: 'subscription',
          },
        },
      },
    };
    jest.spyOn(stripeService, 'verifyStripeEvent').mockReturnValue(mockEvent);
    const subscriptionSpy = jest
      .spyOn(subscriptionService, 'createSubscriptionAfterPayment')
      .mockResolvedValue();

    await handleStripeWebhook(req, res);

    expect(stripeService.verifyStripeEvent).toHaveBeenCalledWith(req);
    expect(subscriptionSpy).toHaveBeenCalledWith('user2', 'prod2');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ received: true });
  });

  test('responds 200 and does nothing if event type is not checkout.session.completed', async () => {
    const mockEvent = { type: 'other.event.type' };
    jest.spyOn(stripeService, 'verifyStripeEvent').mockReturnValue(mockEvent);

    await handleStripeWebhook(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ received: true });
  });

  test('responds 400 and sends error message if verifyStripeEvent throws', async () => {
    const error = new Error('err');
    jest.spyOn(stripeService, 'verifyStripeEvent').mockImplementation(() => {
      throw error;
    });

    await handleStripeWebhook(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith(`Webhook error: ${error.message}`);
  });
});
