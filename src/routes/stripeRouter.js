import express from 'express';
import { handleStripeWebhook } from '../controllers/stripeController.js';

const stripeRouter = express.Router();
stripeRouter.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  handleStripeWebhook
);

export default stripeRouter;
