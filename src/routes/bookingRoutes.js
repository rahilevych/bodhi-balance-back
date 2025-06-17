import express from 'express';
import {
  bookTraining,
  getBookingsByUserId,
} from '../controllers/bookingController.js';
import { verifyUser } from '../middleware/verification.js';

const bookingRouter = express.Router();
bookingRouter.post('/training', verifyUser, bookTraining);
bookingRouter.get('/trainings/:id', verifyUser, getBookingsByUserId);

export default bookingRouter;
