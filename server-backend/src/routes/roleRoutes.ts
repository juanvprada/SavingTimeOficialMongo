import { Router } from 'express';
import { RoleController } from '../controllers/roleController';
import { AuthMiddleware } from '../middleware/authMiddleware';
import { ValidationMiddleware } from '../middleware/validation.middleware';
import { RoleValidation } from '../validations/role.validation';

const router = Router();

router.put('/:id',
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(['admin']),
  ValidationMiddleware.validate(RoleValidation.update),
  RoleController.updateUserRole
);

export default router;
