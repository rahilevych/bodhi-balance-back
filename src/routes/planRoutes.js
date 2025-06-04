import express from 'express';
import { getAllPlans } from '../controllers/planController.js';

const planRouter = express.Router();
planRouter.get('/all', getAllPlans);
export default planRouter;
