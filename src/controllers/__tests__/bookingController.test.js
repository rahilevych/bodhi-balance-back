import * as bookingController from '../../controllers/bookingController.js';
import * as bookingService from '../../services/bookingService.js';
jest.mock('../../services/stripeService.js', () => ({
  createStripeSession: jest.fn(),
}));
describe('bookingController', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      user: { id: 'user123', _id: 'user123' },
      body: {
        productId: 'prod1',
        type: 'training',
        bookingId: 'booking1',
        trainingId: 'training1',
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });
  describe('bookTraining', () => {
    test('answers with 200 and url if result has url', async () => {
      const mockResult = { url: 'http://payment.url' };
      jest.spyOn(bookingService, 'bookTraining').mockResolvedValue(mockResult);

      await bookingController.bookTraining(req, res, next);

      expect(bookingService.bookTraining).toHaveBeenCalledWith(
        req.user.id,
        req.body.productId,
        req.body.type
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ url: mockResult.url });
      expect(next).not.toHaveBeenCalled();
    });

    test('answers with 201 and booking if result has booking', async () => {
      const mockBooking = { id: 'booking123' };
      const mockResult = { booking: mockBooking };
      jest.spyOn(bookingService, 'bookTraining').mockResolvedValue(mockResult);

      await bookingController.bookTraining(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Training booked',
        booking: mockBooking,
      });
    });

    test('answers with 403 and message if result has message', async () => {
      const mockResult = { message: 'Booking not allowed' };
      jest.spyOn(bookingService, 'bookTraining').mockResolvedValue(mockResult);

      await bookingController.bookTraining(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: mockResult.message });
    });

    test('calls next with error if service throws', async () => {
      const error = new Error('err');
      jest.spyOn(bookingService, 'bookTraining').mockRejectedValue(error);

      await bookingController.bookTraining(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getBookingsByUserId', () => {
    test('answers with 200 and bookings array', async () => {
      const mockBookings = [{ id: 'booking1' }, { id: 'booking2' }];
      jest
        .spyOn(bookingService, 'getBookingsByUserId')
        .mockResolvedValue(mockBookings);

      await bookingController.getBookingsByUserId(req, res, next);

      expect(bookingService.getBookingsByUserId).toHaveBeenCalledWith(
        req.user._id
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockBookings);
      expect(next).not.toHaveBeenCalled();
    });

    test('calls next with error if service throws', async () => {
      const error = new Error('err');
      jest
        .spyOn(bookingService, 'getBookingsByUserId')
        .mockRejectedValue(error);

      await bookingController.getBookingsByUserId(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('cancelBooking', () => {
    test('answers with 403 and message if booking has message', async () => {
      const message = 'Cannot cancel booking';
      jest
        .spyOn(bookingService, 'cancelBooking')
        .mockResolvedValue({ message });

      await bookingController.cancelBooking(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
    });

    test('answers with 200 and booking if no message', async () => {
      const booking = { id: 'booking1' };
      jest.spyOn(bookingService, 'cancelBooking').mockResolvedValue(booking);

      await bookingController.cancelBooking(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(booking);
    });

    test('calls next with error if service throws', async () => {
      const error = new Error('err');
      jest.spyOn(bookingService, 'cancelBooking').mockRejectedValue(error);

      await bookingController.cancelBooking(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
