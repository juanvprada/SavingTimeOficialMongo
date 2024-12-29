import { body } from 'express-validator';

export const AuthValidation = {
  register: [
    body('name').notEmpty().withMessage('El nombre es requerido'),
    body('email').isEmail().withMessage('Email inválido'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('La contraseña debe tener al menos 6 caracteres')
  ],
  
  login: [
    body('email').isEmail().withMessage('Email inválido'),
    body('password').notEmpty().withMessage('La contraseña es requerida')
  ],
  
  recoverPassword: [
    body('email').isEmail().withMessage('Email inválido')
  ],
  
  resetPassword: [
    body('token').notEmpty().withMessage('Token es requerido'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('La contraseña debe tener al menos 6 caracteres')
  ]
};