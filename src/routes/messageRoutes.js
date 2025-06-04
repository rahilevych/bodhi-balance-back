import express from 'express';
import { postMessage } from '../controllers/messageController.js';
const messageRouter = express.Router();
messageRouter.post('/message', postMessage);
export default messageRouter;
