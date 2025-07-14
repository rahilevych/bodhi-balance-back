import express from 'express';
import { handleValidationErrors } from '../middleware/validate.js';
import { registerValidation } from '../middleware/validators/authValidator.js';
import { login, logoutUser, register } from '../controllers/authController.js';
import { verifyUser } from '../middleware/verification.js';

const authRouter = express.Router();
authRouter.post(
  '/register',
  registerValidation,
  handleValidationErrors,
  register
);
authRouter.post('/login', handleValidationErrors, login);
authRouter.get('/me', verifyUser, (req, res) => {
  res.status(200).json(req.user);
});
authRouter.post('/logout', logoutUser);
export default authRouter;
