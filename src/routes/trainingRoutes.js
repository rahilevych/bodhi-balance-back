import express from 'express';
import {
  getAllTrainingsForDate,
  getTraining,
} from '../controllers/trainingController.js';

const trainingRouter = express.Router();
trainingRouter.get('/trainings', getAllTrainingsForDate);
trainingRouter.get('/trainings/training/:id', getTraining);
export default trainingRouter;
