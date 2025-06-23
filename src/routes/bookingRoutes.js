import express from 'express';
import {
  bookTraining,
  cancelBooking,
  getBookingsByUserId,
} from '../controllers/bookingController.js';
import { verifyUser } from '../middleware/verification.js';

const bookingRouter = express.Router();
bookingRouter.post('/training', verifyUser, bookTraining);
bookingRouter.patch('/training/cancel', verifyUser, cancelBooking);
bookingRouter.get('/trainings', verifyUser, getBookingsByUserId);

export default bookingRouter;
