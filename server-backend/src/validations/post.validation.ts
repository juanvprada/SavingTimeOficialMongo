import { body } from 'express-validator';

export const PostValidation = {
  create: [
    body('name')
      .notEmpty().withMessage('El nombre es requerido')
      .isLength({ min: 2, max: 255 }).withMessage('El nombre debe tener entre 2 y 255 caracteres'),
    
    body('kindOfPost')
      .notEmpty().withMessage('El tipo de post es requerido'),
    
    body('description')
      .notEmpty().withMessage('La descripción es requerida')
      .isLength({ min: 10 }).withMessage('La descripción debe tener al menos 10 caracteres'),
    
    body('userId')
      .notEmpty().withMessage('El userId es requerido'),
    
    body('city')
      .notEmpty().withMessage('La ciudad es requerida')
      .isString().withMessage('La ciudad debe ser texto')
      .trim()
      .isLength({ min: 2, max: 100 }).withMessage('La ciudad debe tener entre 2 y 100 caracteres'),
    
    body('price')
      .notEmpty().withMessage('El precio es requerido')
      .isNumeric().withMessage('El precio debe ser un número')
      .custom((value) => value >= 0).withMessage('El precio no puede ser negativo')
  ],
  
  update: [
    body('name')
      .optional()
      .notEmpty().withMessage('El nombre no puede estar vacío')
      .isLength({ min: 2, max: 255 }).withMessage('El nombre debe tener entre 2 y 255 caracteres'),
    
    body('kindOfPost')
      .optional()
      .notEmpty().withMessage('El tipo de post no puede estar vacío'),
    
    body('description')
      .optional()
      .notEmpty().withMessage('La descripción no puede estar vacía')
      .isLength({ min: 10 }).withMessage('La descripción debe tener al menos 10 caracteres'),
    
    body('city')
      .optional()
      .notEmpty().withMessage('La ciudad no puede estar vacía')
      .isString().withMessage('La ciudad debe ser texto')
      .trim()
      .isLength({ min: 2, max: 100 }).withMessage('La ciudad debe tener entre 2 y 100 caracteres'),
    
    body('price')
      .optional()
      .isNumeric().withMessage('El precio debe ser un número')
      .custom((value) => value >= 0).withMessage('El precio no puede ser negativo')
  ]
};