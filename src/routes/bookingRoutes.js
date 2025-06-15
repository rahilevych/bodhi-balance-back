import express from 'express';
import { bookTraining } from '../controllers/bookingController.js';
import { verifyUser } from '../middleware/verification.js';

const bookingRouter = express.Router();
bookingRouter.post('/training', verifyUser, bookTraining);
export default bookingRouter;
