import express from 'express';
import {
  getAllTrainingsForDate,
  getTraining,
} from '../controllers/scheduleController.js';

const scheduleRouter = express.Router();
scheduleRouter.get('/trainings', getAllTrainingsForDate);
scheduleRouter.get('/trainings/training/:id', getTraining);
export default scheduleRouter;
