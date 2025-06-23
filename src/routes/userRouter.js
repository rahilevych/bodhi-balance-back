import express from 'express';
import { deleteUser, updateUser } from '../controllers/userController.js';
import { verifyUser } from '../middleware/verification.js';

const userRouter = express.Router();
userRouter.put('/:id', verifyUser, updateUser);
userRouter.delete('/delete', verifyUser, deleteUser);
export default userRouter;
