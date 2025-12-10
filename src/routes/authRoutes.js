import express from 'express';
import { handleValidationErrors } from '../middleware/validate.js';
import { registerValidation } from '../middleware/validators/authValidator.js';
import {
  login,
  logoutUser,
  refreshTokensController,
  register,
} from '../controllers/authController.js';
import { verifyUser } from '../middleware/verification.js';

const authRouter = express.Router();
authRouter.post(
  '/register',
  registerValidation,
  handleValidationErrors,
  register,
);
authRouter.post('/login', handleValidationErrors, login);
authRouter.get('/me', verifyUser, (req, res) => {
  res.status(200).json(req.user);
});
authRouter.get('/refresh', refreshTokensController);
authRouter.post('/logout', logoutUser);
export default authRouter;
