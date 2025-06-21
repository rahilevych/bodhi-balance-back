import express from 'express';

import { verifyUser } from '../middleware/verification.js';
import {
  buySubscription,
  getSubscriptionByUserId,
} from '../controllers/subscriptionController.js';

const subscriptionRouter = express.Router();
subscriptionRouter.post('/buy', verifyUser, buySubscription);
subscriptionRouter.get('/active', verifyUser, getSubscriptionByUserId);

export default subscriptionRouter;
