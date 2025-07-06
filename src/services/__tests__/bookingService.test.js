import Booking from '../../models/Booking.js';
import Subscription from '../../models/Subscription.js';
import Training from '../../models/Training.js';
import User from '../../models/User.js';
import * as stripeService from '../stripeService.js';
import * as bookingService from '../bookingService.js';

jest.mock('../../models/Booking.js');
jest.mock('../../models/Subscription.js');
jest.mock('../../models/Training.js');
jest.mock('../../models/User.js');

jest.mock('../stripeService.js', () => ({
  createStripeSession: jest.fn(),
}));

describe('bookTraining', () => {
  const mockUser = { _id: 'user1' };
  const mockTraining = {
    _id: 'training1',
    priceId: 'price_123',
    datetime: new Date(Date.now() + 3600000),
    spots_taken: 1,
    spots_total: 5,
  };
  test('returns stripe session URL when user have to pay', async () => {
    User.findById.mockResolvedValue(mockUser);
    Training.findById.mockResolvedValue(mockTraining);
    Booking.exists.mockResolvedValue(false);
    stripeService.createStripeSession.mockResolvedValue({
      url: 'https://stripe.com/session',
    });
    Subscription.findOne.mockReturnValue({
      populate: jest.fn().mockResolvedValue(null),
    });
    const res = await bookingService.bookTraining('user1', 'training1', 'pack');
    expect(res).toEqual({ url: 'https://stripe.com/session' });
  });
  test('returns an error if there is no such user or training', async () => {
    User.findById.mockResolvedValue(null);
    Training.findById.mockResolvedValue(null);

    await expect(
      bookingService.bookTraining('user1', 'training1', 'pack')
    ).rejects.toThrow('User or training not found');
  });
  test('returns a message that it already booked', async () => {
    User.findById.mockResolvedValue(mockUser);
    Training.findById.mockResolvedValue(mockTraining);
    Booking.exists.mockResolvedValue(true);

    const res = await bookingService.bookTraining('user1', 'training1', 'pack');

    expect(res).toEqual({ message: 'You have already booked this training!' });
  });
  test('returns a message that booking is closed', async () => {
    User.findById.mockResolvedValue(mockUser);

    const pastTraining = {
      ...mockTraining,
      datetime: new Date(Date.now() - 3600000).toISOString(),
    };

    Training.findById.mockResolvedValue(pastTraining);
    Booking.exists.mockResolvedValue(false);

    const res = await bookingService.bookTraining('user1', 'training1', 'pack');

    expect(res).toEqual({ message: 'Booking closed' });
  });
});

describe('createBooking', () => {
  test('creates a booking and updates training, user, and subscription (pack type)', async () => {
    const mockBooking = { _id: 'booking1' };
    const mockTraining = {
      _id: 'training1',
      spots_taken: 1,
      save: jest.fn().mockResolvedValue(true),
    };

    const mockUser = {
      _id: 'user1',
      bookings: [],
      save: jest.fn().mockResolvedValue(true),
    };
    const mockSubscription = {
      remainingTrainings: 1,
      status: 'active',
      save: jest.fn().mockResolvedValue(true),
      populate: jest.fn().mockResolvedValue({
        type: { type: 'pack' },
      }),
    };
    Booking.create.mockResolvedValue(mockBooking);
    Subscription.findOne.mockReturnValue(mockSubscription);
    const res = await bookingService.createBooking(mockUser, mockTraining);

    expect(Booking.create).toHaveBeenCalledWith({
      user: mockUser._id,
      training: mockTraining._id,
      status: 'booked',
    });
    expect(mockTraining.spots_taken).toBe(2);
    expect(mockTraining.save).toHaveBeenCalled();
    expect(mockUser.bookings).toContain(mockBooking._id);
    expect(mockUser.save).toHaveBeenCalled();
    expect(Subscription.findOne).toHaveBeenCalledWith({
      user: mockUser._id,
      status: 'active',
    });
    expect(mockSubscription.populate).toHaveBeenCalledWith('type');
    expect(mockSubscription.remainingTrainings).toBe(0);
    expect(mockSubscription.status).toBe('expired');
    expect(mockSubscription.save).toHaveBeenCalled();
    expect(res).toEqual(mockBooking);
  });
  test('creates a booking without subscription', async () => {
    const mockBooking = { id: 'booking1' };

    Booking.create.mockResolvedValue(mockBooking);

    const mockTraining = {
      _id: 'training2',
      spots_taken: 0,
      save: jest.fn().mockResolvedValue(true),
    };

    const mockUser = {
      _id: 'user2',
      bookings: [],
      save: jest.fn().mockResolvedValue(true),
    };

    Subscription.findOne.mockResolvedValue(null);

    const result = await bookingService.createBooking(mockUser, mockTraining);

    expect(Booking.create).toHaveBeenCalledWith({
      user: mockUser._id,
      training: mockTraining._id,
      status: 'booked',
    });
    expect(mockTraining.spots_taken).toBe(1);
    expect(mockTraining.save).toHaveBeenCalled();
    expect(mockUser.bookings).toContain(mockBooking._id);
    expect(mockUser.save).toHaveBeenCalled();
    expect(result).toEqual(mockBooking);
  });
});

describe('isTrainingAvailiable', () => {
  test('returns allowed: true', () => {
    const mockTraining = {
      _id: 'training1',
      priceId: 'price_123',
      datetime: new Date(Date.now() + 3600000),
      spots_taken: 1,
      spots_total: 5,
    };
    const res = bookingService.isTrainingAvailiable(mockTraining);
    expect(res).toEqual({ allowed: true });
  });
  test('returns allowed: false, reason: "All spots are taken"', () => {
    const mockTraining = {
      _id: 'training1',
      priceId: 'price_123',
      datetime: new Date(Date.now() + 3600000),
      spots_taken: 5,
      spots_total: 5,
    };
    const res = bookingService.isTrainingAvailiable(mockTraining);
    expect(res).toEqual({ allowed: false, reason: 'All spots are taken' });
  });
  test('returns allowed: false, reason: "Booking closed"', () => {
    const mockTraining = {
      _id: 'training1',
      priceId: 'price_123',
      datetime: new Date(Date.now() - 3600000),
      spots_taken: 1,
      spots_total: 5,
    };
    const res = bookingService.isTrainingAvailiable(mockTraining);
    expect(res).toEqual({ allowed: false, reason: 'Booking closed' });
  });
});

describe('canBookTraining', () => {
  const mockUserId = 'userId';
  const now = new Date();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers().setSystemTime(now);
  });

  test('returns not allowed if no active subscription found', async () => {
    Subscription.findOne.mockReturnValue({
      populate: jest.fn().mockResolvedValue(null),
    });

    const res = await bookingService.canBookTraining(mockUserId);

    expect(res).toEqual({ allowed: false, reason: 'need_payment' });
  });
  test('returns allowed for unlimited plan with valid date', async () => {
    const mockSubscription = {
      validUntil: new Date(now.getTime() + 100000),
      type: { type: 'unlimited' },
    };

    Subscription.findOne.mockReturnValue({
      populate: jest.fn().mockResolvedValue(mockSubscription),
    });

    const res = await bookingService.canBookTraining(mockUserId);

    expect(res).toEqual({ allowed: true });
  });
  test('returns allowed for pack plan with remaining trainings', async () => {
    const mockSubscription = {
      remainingTrainings: 2,
      type: { type: 'pack' },
    };
    Subscription.findOne.mockReturnValue({
      populate: jest.fn().mockResolvedValue(mockSubscription),
    });

    const res = await bookingService.canBookTraining(mockUserId);

    expect(res).toEqual({ allowed: true });
  });
  test('returns not allowed if unlimited plan expired', async () => {
    const mockSubscription = {
      validUntil: new Date(now.getTime() - 100000),
      type: { type: 'unlimited' },
    };

    Subscription.findOne.mockReturnValue({
      populate: jest.fn().mockResolvedValue(mockSubscription),
    });

    const res = await bookingService.canBookTraining(mockUserId);

    expect(res).toEqual({ allowed: false, reason: 'need_payment' });
  });
  test('returns not allowed if pack plan has no trainings left', async () => {
    const mockSubscription = {
      remainingTrainings: 0,
      type: { type: 'pack' },
    };

    Subscription.findOne.mockReturnValue({
      populate: jest.fn().mockResolvedValue(mockSubscription),
    });

    const res = await bookingService.canBookTraining(mockUserId);

    expect(res).toEqual({ allowed: false, reason: 'need_payment' });
  });
});

describe('getBookingsByUserId', () => {
  const mockUserId = 'userId';
  test('updates status to completed if training date in past and status booked', async () => {
    const pastDate = new Date(Date.now() - 1000 * 60 * 60 * 24);
    const futureDate = new Date(Date.now() + 1000 * 60 * 60 * 24);

    const booking1 = {
      training: { datetime: pastDate.toISOString(), yogaStyle_id: {} },
      status: 'booked',
      save: jest.fn().mockResolvedValue(true),
    };

    const booking2 = {
      training: { datetime: futureDate.toISOString(), yogaStyle_id: {} },
      status: 'booked',
      save: jest.fn(),
    };

    Booking.find.mockReturnValue({
      populate: jest.fn().mockResolvedValue([booking1, booking2]),
    });

    const bookings = await bookingService.getBookingsByUserId(mockUserId);

    expect(bookings).toHaveLength(2);
    expect(bookings[0].status).toBe('completed');
    expect(bookings[0].save).toHaveBeenCalled();
    expect(bookings[1].status).toBe('booked');
    expect(bookings[1].save).not.toHaveBeenCalled();
  });
});

describe('createBookingAfterPayment', () => {
  const mockUserId = 'user123';
  const mockTrainingId = 'training123';

  test('throws error if user or training not found', async () => {
    User.findById.mockResolvedValue(null);
    Training.findById.mockResolvedValue(null);

    await expect(
      bookingService.createBookingAfterPayment(mockUserId, mockTrainingId)
    ).rejects.toThrow('User or training not found');
  });

  test('creates booking and return it', async () => {
    const mockBooking = { id: 'booking1' };
    const mockTraining = {
      _id: 'training1',
      spots_taken: 2,
      save: jest.fn().mockResolvedValue(true),
    };

    const mockUser = {
      _id: 'user1',
      bookings: [],
      save: jest.fn().mockResolvedValue(true),
    };
    const mockSubscription = {
      remainingTrainings: 1,
      status: 'active',
      save: jest.fn().mockResolvedValue(true),
      populate: jest.fn().mockResolvedValue({
        type: { type: 'pack' },
      }),
    };

    Subscription.findOne.mockReturnValue(mockSubscription);

    User.findById.mockResolvedValue(mockUser);
    Training.findById.mockResolvedValue(mockTraining);

    const result = await bookingService.createBookingAfterPayment(
      mockUser,
      mockTraining
    );

    expect(result).toEqual({ booking: mockBooking });
  });
});

describe('cancelBooking', () => {
  const mockUserId = 'user123';
  const mockTrainingId = 'training123';
  const mockBookingId = 'booking123';

  beforeEach(() => {
    jest.clearAllMocks();
  });
  test('should throws err if user or booking not found', async () => {
    User.findById.mockResolvedValue(null);
    Booking.findById.mockResolvedValue(null);

    await expect(
      bookingService.cancelBooking(mockUserId, mockBookingId, mockTrainingId)
    ).rejects.toThrow('User or booking not found');
  });

  test('throws err if booking does not belong to user', async () => {
    const fakeUser = { _id: mockUserId };
    const fakeBooking = { user: { equals: jest.fn().mockReturnValue(false) } };

    User.findById.mockResolvedValue(fakeUser);
    Booking.findById.mockResolvedValue(fakeBooking);

    await expect(
      bookingService.cancelBooking(mockUserId, mockBookingId, mockTrainingId)
    ).rejects.toThrow('Unauthorized: This booking does not belong to the user');
  });

  test('doesnt cancel booking if less than 24h before session', async () => {
    const now = new Date();
    const bookingDate = new Date(now.getTime() + 1000 * 60 * 60 * 10);

    const fakeUser = { _id: mockUserId };
    const fakeBooking = {
      user: { equals: jest.fn().mockReturnValue(true) },
      datetime: bookingDate,
      status: 'booked',
      save: jest.fn(),
    };

    User.findById.mockResolvedValue(fakeUser);
    Booking.findById.mockResolvedValue(fakeBooking);

    const result = await bookingService.cancelBooking(
      mockUserId,
      mockBookingId,
      mockTrainingId
    );

    expect(result).toEqual({
      message:
        'You cannot cancel a booking less than 24 hours before the session',
    });
    expect(fakeBooking.save).not.toHaveBeenCalled();
  });

  test('cancels booking and update training spots_taken', async () => {
    const now = new Date();
    const bookingDate = new Date(now.getTime() + 1000 * 60 * 60 * 30);

    const fakeUser = { _id: mockUserId };
    const fakeBooking = {
      user: { equals: jest.fn().mockReturnValue(true) },
      datetime: bookingDate,
      status: 'booked',
      save: jest.fn().mockResolvedValue(true),
    };
    const fakeTraining = {
      spots_taken: 5,
      save: jest.fn().mockResolvedValue(true),
    };

    User.findById.mockResolvedValue(fakeUser);
    Booking.findById.mockResolvedValue(fakeBooking);
    Training.findById.mockResolvedValue(fakeTraining);

    const result = await bookingService.cancelBooking(
      mockUserId,
      mockBookingId,
      mockTrainingId
    );

    expect(result).toBe(fakeBooking);
    expect(fakeBooking.status).toBe('cancelled');
    expect(fakeBooking.save).toHaveBeenCalled();
    expect(fakeTraining.spots_taken).toBe(4);
    expect(fakeTraining.save).toHaveBeenCalled();
  });
});
