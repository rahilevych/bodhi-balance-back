import express from 'express';
import { getAllquestions } from '../controllers/questionController.js';

const questionRouter = express.Router();
questionRouter.get('/all', getAllquestions);
export default questionRouter;
