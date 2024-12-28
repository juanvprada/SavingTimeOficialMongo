import express from 'express';
import { createComment, getCommentsByPostId } from '../controllers/commentController';
import { authMiddleware } from '../middleware/authMiddleware'; 

const router = express.Router();

router.get('/:postId', getCommentsByPostId);
router.post('/:postId/comments', authMiddleware, createComment);

export default router;