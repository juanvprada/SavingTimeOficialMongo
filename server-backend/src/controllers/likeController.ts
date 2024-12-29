import { Response } from 'express';
import { Like } from '../models';
import { AuthRequest, ApiResponse } from '../types/request.types';
import { ILike } from '../interfaces';

export class LikeController {
  static async toggle(req: AuthRequest, res: Response<ApiResponse<{ liked: boolean }>>) {
    const { postId } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ 
        message: 'Usuario no autenticado' 
      });
    }

    try {
      const existingLike = await Like.findOne({ 
        where: { postId, userId } 
      });

      if (existingLike) {
        await existingLike.destroy();
        return res.status(200).json({
          message: 'Like eliminado exitosamente',
          data: { liked: false }
        });
      } 

      await Like.create({ postId, userId });
      
      return res.status(201).json({
        message: 'Like agregado exitosamente',
        data: { liked: true }
      });
    } catch (error) {
      console.error('Error al manejar like:', error);
      return res.status(500).json({
        message: 'Error al manejar el like',
        error
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

