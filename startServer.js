import { app } from './server.js';
import connectDB from './src/config/db.js';
import dotenv from 'dotenv';

dotenv.config();
const PORT = process.env.PORT || 5000;
const DB_URI = process.env.DB_URI;

const startServer = async () => {
  try {
    await connectDB(DB_URI);

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server', error.message);
    process.exit(1);
  }
};

startServer();
