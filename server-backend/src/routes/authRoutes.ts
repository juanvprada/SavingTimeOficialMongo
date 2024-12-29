import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { AuthMiddleware } from '../middleware/authMiddleware';
import { ValidationMiddleware } from '../middleware/validation.middleware';
import { AuthValidation } from '../validations/auth.validation';

const router = Router();

router.post('/register', 
  ValidationMiddleware.validate(AuthValidation.register),
  UserController.register
);

router.post('/login',
  ValidationMiddleware.validate(AuthValidation.login),
  UserController.login
);

router.post('/recuperar-password',
  ValidationMiddleware.validate(AuthValidation.recoverPassword),
  UserController.recoverPassword
);

router.post('/reset-password',
  ValidationMiddleware.validate(AuthValidation.resetPassword),
  UserController.resetPassword
);

router.get('/profile',
  AuthMiddleware.authenticate,
  UserController.getProfile
);

export default router;
