import { body } from 'express-validator';

export const PostValidation = {
  create: [
    body('name').notEmpty().withMessage('El nombre es requerido'),
    body('kindOfPost').notEmpty().withMessage('El tipo de post es requerido'),
    body('description').notEmpty().withMessage('La descripción es requerida'),
    body('userId').notEmpty().withMessage('El userId es requerido')
  ],
  update: [
    body('name').optional().notEmpty().withMessage('El nombre no puede estar vacío'),
    body('kindOfPost').optional().notEmpty().withMessage('El tipo de post no puede estar vacío'),
    body('description').optional().notEmpty().withMessage('La descripción no puede estar vacía')
  ]
};