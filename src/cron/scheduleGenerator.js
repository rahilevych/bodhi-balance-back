import { generateWeeklySchedule } from '../utils/generateSchedule.js';
import connectDB from '../config/db.js';

export async function generateDaileSchedule() {
  const DB_URI = process.env.DB_URI;
  try {
    connectDB(DB_URI);
    await generateWeeklySchedule();
  } catch (err) {
    console.error('Error generation schedule!', err);
  }
}
