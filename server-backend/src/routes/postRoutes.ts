import { Router } from 'express';
import { PostController } from '../controllers/postController';
import { AuthMiddleware } from '../middleware/authMiddleware';
import { UploadMiddleware } from '../middleware/upload.middleware';
import { ValidationMiddleware } from '../middleware/validation.middleware';
import { PostValidation } from '../validations/post.validation';

const router = Router();

router.get('/', PostController.getAll);

router.get('/:id', PostController.getById);

router.post('/',
  AuthMiddleware.authenticate,
  UploadMiddleware.array('images', 10), 
  ValidationMiddleware.validate(PostValidation.create),
  PostController.create
);

router.put('/:id',
  AuthMiddleware.authenticate,
  UploadMiddleware.array('images', 10),
  ValidationMiddleware.validate(PostValidation.update),
  PostController.update
);

router.delete('/:id',
  AuthMiddleware.authenticate,
  PostController.delete
);

export default router;




