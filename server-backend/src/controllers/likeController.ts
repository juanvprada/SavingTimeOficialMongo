import { Response } from 'express';
import { Like } from '../models';
import { AuthRequest, ApiResponse } from '../types/request.types';
import { ILike } from '../interfaces';

export class LikeController {
  static async toggle(req: AuthRequest, res: Response) {
    try {
      const { postId } = req.params;
      const userId = req.user?.userId;
  
      console.log('Toggle like attempt:', { postId, userId });
  
      if (!postId || !userId) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
  
      const existingLike = await Like.findOne({ 
        where: { postId, userId },
        logging: console.log 
      });
  
      console.log('Found existing like:', existingLike);
  
      if (existingLike) {
        await existingLike.destroy();
        return res.json({ data: { liked: false } });
      }
  
      const newLike = await Like.create({ postId, userId });
      console.log('Created new like:', newLike.toJSON());
      
      return res.json({ data: { liked: true } });
  
    } catch (error) {
      console.error('Like toggle error:', error);
      return res.status(500).json({ 
        message: 'Error al manejar el like',
      });
    }
  }
  

  static async getLikeCount(req: AuthRequest, res: Response<ApiResponse<{ count: number }>>) {
    const { postId } = req.params;

    try {
      const count = await Like.count({
        where: { postId }
      });

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
      const count = await Like.count({ where: { postId } });

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

