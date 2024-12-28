import express from 'express';
import { toggleLike } from '../controllers/likeController';
import LikeModel from '../models/likeModel';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/:postId/toggle', authMiddleware, toggleLike);

router.get('/:postId/likes', async (req, res) => {
    const postId = req.params.postId;

    try {
        const count = await LikeModel.getLikesByPost(postId);
        res.status(200).json({ count });
    } catch (error) {
        console.error('Error al obtener el conteo de likes:', error);
        res.status(500).json({ message: 'Error interno al intentar obtener los likes.', error: (error instanceof Error ? error.message : 'Error desconocido') });
    }
});

export default router;







