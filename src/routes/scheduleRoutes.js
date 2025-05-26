import express from 'express';
import { get } from 'mongoose';
import { getAllTrainingsForDate } from '../controllers/scheduleController.js';

const scheduleRouter = express.Router();
scheduleRouter.get('/trainings', getAllTrainingsForDate);
export default scheduleRouter;
