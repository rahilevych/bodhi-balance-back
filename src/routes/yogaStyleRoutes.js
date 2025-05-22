import express from 'express';

import { getAllStyles } from '../controllers/yogaStyleController.js';
const styleRouter = express.Router();
styleRouter.get('/styles', getAllStyles);
export default styleRouter;
