import cron from 'node-cron';
import connectDB from '../config/db.js';
import { generateWeeklySchedule } from '../utils/generateSchedule.js';

cron.schedule('00 03 * * *', async () => {
  const DB_URI = process.env.DB_URI;
  try {
    connectDB(DB_URI);
    await generateWeeklySchedule();
  } catch (err) {
    console.error('Error generation schedule!', err);
  }
});
