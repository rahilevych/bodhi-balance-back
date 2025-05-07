import express from 'express';
import { handleValidationErrors } from '../middleware/validate.js';
import { registerValidation } from '../middleware/validators/authValidator.js';
import errorHandler from '../middleware/errorHandler.js';
import { login, register } from '../controllers/authController.js';

const authRouter = express.Router();
authRouter.post(
  '/register',
  registerValidation,
  handleValidationErrors,
  errorHandler,
  register
);
authRouter.post('/login', errorHandler, login);
export default authRouter;
