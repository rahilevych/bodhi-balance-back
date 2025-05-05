import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import mongoose from 'mongoose';
import morgan from 'morgan';

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json);

app.get('/', (req, res) => {
  res.send('🧘 Yoga API is working');
});

const PORT = process.env.PORT || 5000;
const DB_URI = process.env.DB_URI;

try {
  await mongoose.connect(DB_URI);
  console.log('MongoDB connected');

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
} catch (error) {
  console.error('Error connecting to MongoDB:', error.message);
  process.exit(1);
}
