import express from 'express';
import { getAllTrainers } from '../controllers/trainerController.js';

const trainerRouter = express.Router();
trainerRouter.get('/all', getAllTrainers);
export default trainerRouter;
