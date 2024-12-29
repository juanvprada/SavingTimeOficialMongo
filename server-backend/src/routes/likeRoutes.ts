import { Router } from 'express';
import { LikeController } from '../controllers/likeController';
import { AuthMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.post('/:postId/toggle',
  AuthMiddleware.authenticate,
  LikeController.toggle
);

router.get('/:postId/count',
  LikeController.getCount
);

export default router;







