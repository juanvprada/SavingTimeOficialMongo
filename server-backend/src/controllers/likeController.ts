import { CustomRequest } from '../middleware/authMiddleware';
import { Response } from 'express';
import Like from '../models/likeModel';

export const toggleLike = async (req: CustomRequest, res: Response) => {
  const { postId } = req.params;
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ message: 'Usuario no autenticado.' });
  }

  try {
    const existingLike = await Like.findOne({ where: { postId, userId } });

    if (existingLike) {
      await existingLike.destroy();
      return res.status(200).json({ message: 'Like eliminado exitosamente.', liked: false });
    } else {
      await Like.create({ postId, userId });
      return res.status(201).json({ message: 'Like agregado exitosamente.', liked: true });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al manejar el like.', error });
  }
};

