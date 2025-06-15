import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import errorHandler from './src/middleware/errorHandler.js';
import authRouter from './src/routes/authRoutes.js';
import cookieParser from 'cookie-parser';
import styleRouter from './src/routes/yogaStyleRoutes.js';
import './src/cron/scheduleGenerator.js';
import trainerRouter from './src/routes/trainerRoutes.js';
import questionRouter from './src/routes/questionRoutes.js';
import messageRouter from './src/routes/messageRoutes.js';
import planRouter from './src/routes/planRoutes.js';
import userRouter from './src/routes/userRouter.js';
import connectDB from './src/config/db.js';
import trainingRouter from './src/routes/trainingRoutes.js';
import bookingRouter from './src/routes/bookingRoutes.js';
import stripeRouter from './src/routes/stripeRouter.js';
import { handleStripeWebhook } from './src/controllers/stripeController.js';

dotenv.config();
const CLIENT_URL = process.env.CLIENT_URL;
const app = express();
app.use(cookieParser());
app.use(helmet());
app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(morgan('dev'));

app.post(
  '/stripe/webhook',
  express.raw({ type: 'application/json' }),
  handleStripeWebhook
);
app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRouter);
app.use('/yoga', styleRouter);
app.use('/schedule', trainingRouter);
app.use('/trainers', trainerRouter);
app.use('/questions', questionRouter);
app.use('/contact', messageRouter);
app.use('/plans', planRouter);
app.use('/users', userRouter);
app.use('/booking', bookingRouter);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const DB_URI = process.env.DB_URI;

connectDB(DB_URI);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
