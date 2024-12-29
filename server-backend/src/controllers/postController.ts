import { Response } from 'express';
import { Post, User } from '../models';
import { v4 as uuidv4 } from 'uuid';
import { AuthRequest, ApiResponse } from '../types/request.types';
import { IPost } from '../interfaces';
import { CONFIG } from '../config/constants';
import { ValidationError } from 'sequelize';

export class PostController {
  // Crear un nuevo post
  static async create(req: AuthRequest, res: Response<ApiResponse<IPost>>) {
    const { name, kindOfPost, description, userId } = req.body;

    if (!name || !kindOfPost || !description || !userId) {
      return res.status(400).json({
        message: 'Los campos nombre, tipo, descripción y usuario son obligatorios'
      });
    }

    try {
      let image = '';
      if (req.file) {
        image = `/${CONFIG.UPLOAD.PATH}/${req.file.filename}`;
      }

      const newPost = await Post.create({
        id: uuidv4(),
        name,
        kindOfPost,
        description,
        image,
        userId
      });

      return res.status(201).json({
        message: 'Post creado con éxito',
        data: newPost
      });
    } catch (error) {
      console.error('Error detallado al crear post:', error);

      if (error instanceof ValidationError) {
        return res.status(400).json({
          message: 'Error de validación',
        });
      }

      return res.status(500).json({
        message: 'Error al crear el post',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  // Obtener un post por ID
  static async getById(req: AuthRequest, res: Response<ApiResponse<IPost>>) {
    const { id } = req.params;

    try {
      const post = await Post.findByPk(id, {
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'name'] // Make sure we're including the name
        }]
      });

      if (!post) {
        return res.status(404).json({
          message: 'Post no encontrado'
        });
      }

      // Get the plain object and format dates
      const formattedPost = {
        ...post.get({ plain: true }),
        created_at: post.created_at
          ? new Date(post.created_at as Date | string).toISOString()
          : null,
        updated_at: post.updated_at
          ? new Date(post.updated_at as Date | string).toISOString()
          : null,
        image: post.image
          ? `http://localhost:5000${post.image}`
          : 'http://localhost:5000/uploads/default.jpg'
      };

      return res.json({
        message: 'Post encontrado',
        data: formattedPost
      });
    } catch (error) {
      console.error('Error al obtener post:', error);
      return res.status(500).json({
        message: 'Error al obtener el post',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  // Actualizar un post
  static async update(req: AuthRequest, res: Response<ApiResponse<IPost>>) {
    const { id } = req.params;
    const { name, kindOfPost, description } = req.body;
    const image = req.file ? `/${CONFIG.UPLOAD.PATH}/${req.file.filename}` : undefined;

    try {
      const post = await Post.findByPk(id);

      if (!post) {
        return res.status(404).json({
          message: 'Post no encontrado'
        });
      }

      const updatedPost = await post.update({
        name,
        kindOfPost,
        description,
        image: image || post.image
      });

      return res.json({
        message: 'Post actualizado con éxito',
        data: updatedPost
      });
    } catch (error) {
      console.error('Error al actualizar post:', error);
      return res.status(500).json({
        message: 'Error al actualizar el post',
        error
      });
    }
  }

  // Eliminar un post
  static async delete(req: AuthRequest, res: Response<ApiResponse>) {
    const { id } = req.params;

    try {
      const post = await Post.findByPk(id);

      if (!post) {
        return res.status(404).json({
          message: 'Post no encontrado'
        });
      }

      await post.destroy();

      return res.json({
        message: 'Post eliminado con éxito'
      });
    } catch (error) {
      console.error('Error al eliminar post:', error);
      return res.status(500).json({
        message: 'Error al eliminar el post',
        error
      });
    }
  }

  // Obtener todos los posts (modificado para devolver fechas ISO)
  static async getAll(req: AuthRequest, res: Response<ApiResponse<IPost[]>>) {
    try {
      const posts = await Post.findAll({
        include: [{
          model: User,
          as: 'user',
          attributes: ['name']
        }],
        order: [['created_at', 'DESC']]
      });

      const formattedPosts = posts.map((post) => ({
        ...post.get({ plain: true }),
        created_at: post.created_at
          ? new Date(post.created_at as Date | string).toISOString()
          : null,
        updated_at: post.updated_at
          ? new Date(post.updated_at as Date | string).toISOString()
          : null,
        image: post.image
          ? `http://localhost:5000${post.image}`
          : 'http://localhost:5000/uploads/default.jpg'
      }));


      return res.json({
        message: 'Posts obtenidos con éxito',
        data: formattedPosts
      });
    } catch (error) {
      console.error('Error al obtener posts:', error);
      return res.status(500).json({
        message: 'Error al obtener posts',
        error
      });
    }
  }
}
