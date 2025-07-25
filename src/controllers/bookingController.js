import * as bookingService from '../services/bookingService.js';

export const bookTraining = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId, type } = req.body;
    const result = await bookingService.bookTraining(userId, productId, type);
    if (result?.url) {
      return res.status(200).json({ url: result.url });
    }
    if (result?.booking) {
      return res
        .status(201)
        .json({ message: 'Training booked', booking: result.booking });
    }
    if (result?.message) {
      return res.status(403).json({ message: result.message });
    }
  } catch (error) {
    next(error);
  }
};
export const getBookingsByUserId = async (req, res, next) => {
  const userId = req.user._id;
  try {
    const bookings = await bookingService.getBookingsByUserId(userId);
    res.status(200).json(bookings);
  } catch (error) {
    next(error);
  }
};
export const cancelBooking = async (req, res, next) => {
  const userId = req.user._id;
  const { bookingId, trainingId } = req.body;
  try {
    const booking = await bookingService.cancelBooking(
      userId,
      bookingId,
      trainingId
    );
    if (booking.message) {
      res.status(403).json({ message: booking.message });
    }
    return res.status(200).json(booking);
  } catch (error) {
    next(error);
  }
};
