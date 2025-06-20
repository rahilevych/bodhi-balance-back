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
  const userId = req.params.id;
  try {
    const bookings = await bookingService.getBookingsByUserId(userId);
    res.status(200).json(bookings);
  } catch (error) {
    next(error);
  }
};
