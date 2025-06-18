import express from 'express';

import { verifyUser } from '../middleware/verification.js';
import { buySubscription } from '../controllers/subscriptionController.js';

const subscriptionRouter = express.Router();
subscriptionRouter.post('/buy', verifyUser, buySubscription);

export default subscriptionRouter;
