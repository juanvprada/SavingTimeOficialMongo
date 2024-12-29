import { Response } from 'express';
import { Comment, User } from '../models';
import { AuthRequest, ApiResponse } from '../types/request.types';
import { IComment } from '../interfaces';
import { validate as isValidUUID } from 'uuid';
import { ValidationError, ForeignKeyConstraintError } from 'sequelize';

export class CommentController {
  static async create(req: AuthRequest, res: Response<ApiResponse<IComment>>) {
    const { postId } = req.params;
    const userId = req.user?.userId;
    const { content } = req.body;

    if (!userId) {
      return res.status(401).json({
        message: 'Usuario no autenticado'
      });
    }

    try {
      const newComment = await Comment.create({
        userId,
        postId,
        content
      });

      const commentWithUser = await Comment.findOne({
        where: { id: newComment.id },
        include: [{
          model: User,
          as: 'user',
          attributes: ['name']
        }]
      });

      if (!commentWithUser) {
        return res.status(500).json({
          message: 'Error al obtener el comentario creado'
        });
      }

      return res.status(201).json({
        message: 'Comentario creado exitosamente',
        data: commentWithUser.toJSON() as IComment
      });
    } catch (error: unknown) {
      console.error('Error al crear comentario:', error);

      if (error instanceof ValidationError) {
        return res.status(400).json({
          message: 'Error de validación',
          error: {
            details: error.errors.map(e => ({
              field: e.path,
              message: e.message
            }))
          }
        });
      }

      return res.status(500).json({
        message: 'Error al crear comentario'
      });
    }
  }

  static async getByPostId(req: AuthRequest, res: Response<ApiResponse<IComment[]>>) {
    const { postId } = req.params;

    try {
      const comments = await Comment.findAll({
        where: { postId },
        include: [{
          model: User,
          as: 'user',
          attributes: ['name']
        }],
        order: [['created_at', 'DESC']]
      });

      // Format the comments with proper date handling
      const formattedComments = comments.map(comment => {
        const plainComment = comment.get({ plain: true });
        return {
          ...plainComment,
          created_at: comment.created_at ? new Date(comment.created_at).toISOString() : null,
          updated_at: comment.updated_at ? new Date(comment.updated_at).toISOString() : null
        };
      });

      console.log('Formatted comments:', formattedComments); // Debug log

      return res.status(200).json({
        message: formattedComments.length ? 'Comentarios obtenidos exitosamente' : 'No hay comentarios',
        data: formattedComments
      });
    } catch (error: unknown) {
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
      const comment = await Comment.findOne({
        where: {
          id,
          user_id: userId
        }
      });

      if (!comment) {
        return res.status(404).json({
          message: 'Comentario no encontrado o no autorizado para editarlo'
        });
      }

      const updatedComment = await comment.update({ content });

      return res.status(200).json({
        message: 'Comentario actualizado exitosamente',
        data: updatedComment.get({ plain: true }) as IComment
      });
    } catch (error: unknown) {
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
      const comment = await Comment.findOne({
        where: {
          id,
          user_id: userId
        }
      });

      if (!comment) {
        return res.status(404).json({
          message: 'Comentario no encontrado o no autorizado para eliminarlo'
        });
      }

      await comment.destroy();

      return res.status(200).json({
        message: 'Comentario eliminado exitosamente'
      });
    } catch (error: unknown) {
      console.error('Error al eliminar comentario:', error);
      return res.status(500).json({
        message: 'Error al eliminar comentario'
      });
    }
  }
}