import * as bookingService from '../services/bookingService.js';

export const bookTraining = async (req, res, next) => {
  console.log(req.user);
  try {
    const userId = req.user.id;
    console.log('user', userId);
    const { trainingId } = req.body;

    const result = await bookingService.bookTraining(userId, trainingId);

    if (result?.url) {
      return res.status(200).json({ url: result.url });
    }

    return res
      .status(201)
      .json({ message: 'Training booked', booking: result.booking });
  } catch (error) {
    next(error);
  }
};
