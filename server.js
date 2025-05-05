import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import mongoose from 'mongoose';
import morgan from 'morgan';
import connectDB from './src/config/db';

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json);

const PORT = process.env.PORT || 5000;
const DB_URI = process.env.DB_URI;

connectDB(DB_URI);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
