import { body } from 'express-validator';

export const CommentValidation = {
  create: [
    body('content').notEmpty().withMessage('El contenido es requerido')
  ],
  update: [
    body('content').notEmpty().withMessage('El contenido es requerido')
  ]
};