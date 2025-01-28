import { Response } from 'express';
import { Like } from '../models/likeModel';
import { AuthRequest, ApiResponse } from '../types/request.types';

export class LikeController {
  static async toggle(req: AuthRequest, res: Response) {
    const { postId } = req.params;
    const userId = req.user?.userId;

    try {
      const existingLike = await Like.findOne({ postId, userId });

      if (existingLike) {
        await Like.deleteOne({ _id: existingLike._id });
        return res.json({ data: { liked: false } });
      }

      await Like.create({ postId, userId });
      return res.json({ data: { liked: true } });
    } catch (error) {
      console.error('Error al manejar like:', error);
      return res.status(500).json({
        message: 'Error al manejar el like'
      });
    }
  }

  static async getLikeCount(req: AuthRequest, res: Response<ApiResponse<{ count: number }>>) {
    const { postId } = req.params;

    try {
      const count = await Like.countDocuments({ postId });

      return res.json({
        message: 'Conteo de likes obtenido',
        data: { count }
      });
    } catch (error) {
      console.error('Error al obtener conteo de likes:', error);
      return res.status(500).json({
        message: 'Error al obtener conteo de likes',
        error
      });
    }
  }

  static async getCount(req: AuthRequest, res: Response<ApiResponse<{ count: number }>>) {
    const { postId } = req.params;

    try {
      const count = await Like.countDocuments({ postId });

      return res.json({
        message: 'Conteo de likes obtenido exitosamente',
        data: { count }
      });
    } catch (error) {
      console.error('Error al obtener conteo de likes:', error);
      return res.status(500).json({
        message: 'Error al obtener conteo de likes',
        error
      });
    }
  }
}


