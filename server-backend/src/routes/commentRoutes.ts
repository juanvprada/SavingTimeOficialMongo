import { Router } from 'express';
import { CommentController } from '../controllers/commentController';
import { AuthMiddleware } from '../middleware/authMiddleware';
import { ValidationMiddleware } from '../middleware/validation.middleware';
import { CommentValidation } from '../validations/comment.validation';

const router = Router();

router.get('/:postId',
  CommentController.getByPostId
);

router.post('/:postId',
  AuthMiddleware.authenticate,
  ValidationMiddleware.validate(CommentValidation.create),
  CommentController.create
);

router.put('/:id',
  AuthMiddleware.authenticate,
  ValidationMiddleware.validate(CommentValidation.update),
  CommentController.update
);

router.delete('/:id',
  AuthMiddleware.authenticate,
  CommentController.delete
);

export default router;