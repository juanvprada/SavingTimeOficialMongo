import { Response } from 'express';
import { Comment } from '../models/commentModel';
import { AuthRequest, ApiResponse } from '../types/request.types';
import { IComment } from '../interfaces';

export class CommentController {
  static async create(req: AuthRequest, res: Response<ApiResponse<IComment>>) {
    const { postId, content } = req.body;
    const userId = req.user?.userId;

    try {
      const newComment = await Comment.create({ postId, content, userId });
      const populatedComment = await newComment.populate('userId', 'name');

      return res.status(201).json({
        message: 'Comentario creado exitosamente',
        data: populatedComment
      });
    } catch (error) {
      console.error('Error al crear comentario:', error);
      return res.status(500).json({
        message: 'Error al crear comentario'
      });
    }
  }

  static async getByPostId(req: AuthRequest, res: Response<ApiResponse<IComment[]>>) {
    const { postId } = req.params;

    try {
      const comments = await Comment.find({ postId })
        .populate('userId', 'name') // Relación con el usuario
        .sort({ createdAt: -1 }); // Ordenar por fecha de creación

      return res.status(200).json({
        message: comments.length ? 'Comentarios obtenidos exitosamente' : 'No hay comentarios',
        data: comments
      });
    } catch (error) {
      console.error('Error al obtener comentarios:', error);
      return res.status(500).json({
        message: 'Error al obtener comentarios',
        data: []
      });
    }
  }

  static async update(req: AuthRequest, res: Response<ApiResponse<IComment>>) {
    const { id } = req.params;
    const userId = req.user?.userId;
    const { content } = req.body;

    if (!userId) {
      return res.status(401).json({
        message: 'Usuario no autenticado'
      });
    }

    try {
      const comment = await Comment.findOne({ _id: id, userId });

      if (!comment) {
        return res.status(404).json({
          message: 'Comentario no encontrado o no autorizado para editarlo'
        });
      }

      comment.content = content;
      await comment.save();

      return res.status(200).json({
        message: 'Comentario actualizado exitosamente',
        data: comment
      });
    } catch (error) {
      console.error('Error al actualizar comentario:', error);
      return res.status(500).json({
        message: 'Error al actualizar comentario'
      });
    }
  }

  static async delete(req: AuthRequest, res: Response<ApiResponse>) {
    const { id } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        message: 'Usuario no autenticado'
      });
    }

    try {
      const comment = await Comment.findOne({ _id: id, userId });

      if (!comment) {
        return res.status(404).json({
          message: 'Comentario no encontrado o no autorizado para eliminarlo'
        });
      }

      await comment.deleteOne();

      return res.status(200).json({
        message: 'Comentario eliminado exitosamente'
      });
    } catch (error) {
      console.error('Error al eliminar comentario:', error);
      return res.status(500).json({
        message: 'Error al eliminar comentario'
      });
    }
  }
}
