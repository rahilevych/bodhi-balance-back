import cron from 'node-cron';

import { generateWeeklySchedule } from '../utils/generateSchedule.js';
import connectDB from '../config/db.js';

cron.schedule('35 12 * * *', async () => {
  const DB_URI = process.env.DB_URI;
  try {
    connectDB(DB_URI);
    await generateWeeklySchedule();
  } catch (err) {
    console.error('Error generation schedule!', err);
  }
});
