import { Request, Response } from 'express';
import Comment from '../models/commentModel';
import User from '../models/userModel';
import { CustomRequest } from '../middleware/authMiddleware';
import { validate as isValidUUID } from 'uuid';

//=====================
// Crear un comentario
//=====================
export const createComment = async (req: CustomRequest, res: Response) => {
  try {
    const { postId } = req.params;
    const userId = req.user?.userId;
    const { content } = req.body;

    // Verificar si el usuario está autenticado
    if (!userId) {
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }

    // Validar UUID del post
    if (!isValidUUID(postId)) {
      return res.status(400).json({ message: 'Post ID inválido' });
    }

    // Validar contenido del comentario
    if (!content || content.trim() === '') {
      return res.status(400).json({ message: 'El contenido del comentario no puede estar vacío' });
    }

    // Crear el comentario
    const newComment = await Comment.create({ userId, postId, content });
    
    // Incluir el nombre del usuario en la respuesta
    const user = await User.findByPk(userId);
    if (user) {
      res.status(201).json({ ...newComment.toJSON(), username: user.name });
    } else {
      res.status(201).json(newComment);
    }
  } catch (error) {
    console.error('Error creando comentario:', error);
    const errorMessage = (error instanceof Error) ? error.message : 'Unknown error';
    res.status(500).json({ message: 'Error creando comentario', error: errorMessage });
  }
};

//===============================
// Obtener comentarios por postId
//===============================
export const getCommentsByPostId = async (req: CustomRequest, res: Response) => {
  try {
    const { postId } = req.params;

    // Validar UUID del post
    if (!isValidUUID(postId)) {
      return res.status(400).json({ message: 'Post ID inválido' });
    }

    // Obtener comentarios por postId e incluir el nombre del usuario
    const comments = await Comment.findAll({
      where: { postId },
      include: [{
        model: User,
        as: 'user', // Asegúrate de que esto coincide con la asociación
        attributes: ['name']
      }],
      order: [['created_at', 'DESC']]
    });

    // Verificar si se encontraron comentarios
    if (comments.length === 0) {
      return res.status(404).json({ message: 'No se encontraron comentarios para este post' });
    }

    res.status(200).json(comments.map(comment => ({
      id: comment.id,
      postId: comment.postId,
      userId: comment.userId,
      content: comment.content,
      created_at: comment.created_at,
      username: (comment as any).user.name // Utiliza "as any" para evitar el error de tipo
    })));
  } catch (error) {
    console.error('Error obteniendo comentarios:', error);
    const errorMessage = (error instanceof Error) ? error.message : 'Unknown error';
    res.status(500).json({ message: 'Error obteniendo comentarios', error: errorMessage });
  }
};
