// auth.validation.ts
import { body } from 'express-validator';

export const AuthValidation = {
  register: [
    body('name')
      .trim()
      .notEmpty().withMessage('El nombre es requerido')
      .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres')
      .matches(/^[a-zA-ZÀ-ÿ\s]{2,}$/).withMessage('El nombre solo debe contener letras'),
    
    body('email')
      .trim()
      .notEmpty().withMessage('El email es requerido')
      .isEmail().withMessage('Email inválido')
      .normalizeEmail(),
    
    body('password')
      .trim()
      .notEmpty().withMessage('La contraseña es requerida')
      .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
      .matches(/\d/).withMessage('La contraseña debe contener al menos un número')
  ],
  
  login: [
    body('email')
      .trim()
      .notEmpty().withMessage('El email es requerido')
      .isEmail().withMessage('Email inválido')
      .normalizeEmail(),
    
    body('password')
      .trim()
      .notEmpty().withMessage('La contraseña es requerida')
  ],
  
  recoverPassword: [
    body('email')
      .trim()
      .notEmpty().withMessage('El email es requerido')
      .isEmail().withMessage('Email inválido')
      .normalizeEmail()
  ],
  
  resetPassword: [
    body('token')
      .trim()
      .notEmpty().withMessage('Token es requerido'),
    
    body('password')
      .trim()
      .notEmpty().withMessage('La contraseña es requerida')
      .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
      .matches(/\d/).withMessage('La contraseña debe contener al menos un número')
  ]
};