import { body } from 'express-validator';
import { UserRole } from '../interfaces';

export const RoleValidation = {
  update: [
    body('role')
      .isIn(Object.values(UserRole))
      .withMessage('Rol no válido')
  ]
};