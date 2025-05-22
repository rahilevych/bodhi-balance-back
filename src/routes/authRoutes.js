import express from 'express';
import { handleValidationErrors } from '../middleware/validate.js';
import { registerValidation } from '../middleware/validators/authValidator.js';
import errorHandler from '../middleware/errorHandler.js';
import { login, logoutUser, register } from '../controllers/authController.js';
import { verifyUser } from '../middleware/verification.js';

const authRouter = express.Router();
authRouter.post(
  '/register',
  registerValidation,
  handleValidationErrors,
  errorHandler,
  register
);
authRouter.post('/login', login);
authRouter.get('/me', verifyUser, (req, res) => {
  res.status(200).json(req.user);
});
authRouter.post('/logout', logoutUser);
export default authRouter;
