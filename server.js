import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';

import morgan from 'morgan';
import connectDB from './src/config/db.js';
import errorHandler from './src/middleware/errorHandler.js';
import authRouter from './src/routes/authRoutes.js';
import cookieParser from 'cookie-parser';
import styleRouter from './src/routes/yogaStyleRoutes.js';

dotenv.config();

const app = express();
app.use(cookieParser());
app.use(helmet());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use('/auth', authRouter);
app.use('/yoga', styleRouter);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const DB_URI = process.env.DB_URI;

connectDB(DB_URI);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
