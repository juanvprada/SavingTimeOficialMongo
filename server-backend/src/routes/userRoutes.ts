import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { AuthMiddleware } from '../middleware/authMiddleware';
import { UserRole } from '../interfaces';

const router = Router();

router.get('/',
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize([UserRole.ADMIN]),
  UserController.getAll
);

router.get('/:id',
  AuthMiddleware.authenticate,
  UserController.getById
);

router.put('/:id',
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize([UserRole.ADMIN]),
  UserController.update
);

export default router;
