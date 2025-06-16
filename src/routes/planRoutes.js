import express from 'express';
import { getAllPlans, getPlanById } from '../controllers/planController.js';

const planRouter = express.Router();
planRouter.get('/all', getAllPlans);
planRouter.get('/all/:id', getPlanById);
export default planRouter;
