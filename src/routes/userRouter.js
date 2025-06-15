import express from 'express';
import { updateUser } from '../controllers/userController.js';
import { verifyUser } from '../middleware/verification.js';

const userRouter = express.Router();
userRouter.put('/:id', verifyUser, updateUser);
export default userRouter;
