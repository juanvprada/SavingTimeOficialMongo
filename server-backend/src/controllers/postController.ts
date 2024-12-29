// postController.ts
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
      // Handle multiple images
      const images: string[] = [];
      if (req.files && Array.isArray(req.files)) {
        (req.files as Express.Multer.File[]).forEach(file => {
          images.push(`/${CONFIG.UPLOAD.PATH}/${file.filename}`);
        });
      }

      const newPost = await Post.create({
        id: uuidv4(),
        name,
        kindOfPost,
        description,
        images, // Store array of image paths
        userId
      });

      // Format the response
      const formattedPost = {
        ...newPost.get({ plain: true }),
        images: images.map(image => `http://localhost:5000${image}`)
      };

      return res.status(201).json({
        message: 'Post creado con éxito',
        data: formattedPost
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
          attributes: ['id', 'name']
        }]
      });

      if (!post) {
        return res.status(404).json({
          message: 'Post no encontrado'
        });
      }

      // Get the plain object and format dates and images
      const formattedPost = {
        ...post.get({ plain: true }),
        created_at: post.created_at
          ? new Date(post.created_at as Date | string).toISOString()
          : null,
        updated_at: post.updated_at
          ? new Date(post.updated_at as Date | string).toISOString()
          : null,
        images: post.images && Array.isArray(post.images) && post.images.length > 0
          ? post.images.map(image => `http://localhost:5000${image}`)
          : ['http://localhost:5000/uploads/default.jpg']
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

    try {
      const post = await Post.findByPk(id);

      if (!post) {
        return res.status(404).json({
          message: 'Post no encontrado'
        });
      }

      // Handle new images while keeping existing ones
      let updatedImages = post.images || [];
      if (req.files && Array.isArray(req.files)) {
        const newImages = (req.files as Express.Multer.File[]).map(file =>
          `/${CONFIG.UPLOAD.PATH}/${file.filename}`
        );
        updatedImages = [...updatedImages, ...newImages];
      }

      const updatedPost = await post.update({
        name,
        kindOfPost,
        description,
        images: updatedImages
      });

      // Format the response
      const formattedPost = {
        ...updatedPost.get({ plain: true }),
        images: updatedImages.map(image => `http://localhost:5000${image}`)
      };

      return res.json({
        message: 'Post actualizado con éxito',
        data: formattedPost
      });
    } catch (error) {
      console.error('Error al actualizar post:', error);
      return res.status(500).json({
        message: 'Error al actualizar el post',
        error: error instanceof Error ? error.message : 'Error desconocido'
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

      // Optional: Delete image files from the server
      if (post.images && Array.isArray(post.images)) {
        // You might want to add file deletion logic here
        // Remember to handle errors appropriately
      }

      await post.destroy();

      return res.json({
        message: 'Post eliminado con éxito'
      });
    } catch (error) {
      console.error('Error al eliminar post:', error);
      return res.status(500).json({
        message: 'Error al eliminar el post',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  // Obtener todos los posts
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
        images: post.images && Array.isArray(post.images) && post.images.length > 0
          ? post.images.map(image => `http://localhost:5000${image}`)
          : ['http://localhost:5000/uploads/default.jpg']
      }));

      return res.json({
        message: 'Posts obtenidos con éxito',
        data: formattedPosts
      });
    } catch (error) {
      console.error('Error al obtener posts:', error);
      return res.status(500).json({
        message: 'Error al obtener posts',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  // Opcional: Método para eliminar una imagen específica de un post
  static async removeImage(req: AuthRequest, res: Response<ApiResponse<IPost>>) {
    const { id } = req.params;
    const { imageIndex } = req.body;

    try {
      const post = await Post.findByPk(id);

      if (!post) {
        return res.status(404).json({
          message: 'Post no encontrado'
        });
      }

      if (!Array.isArray(post.images) || imageIndex >= post.images.length) {
        return res.status(400).json({
          message: 'Índice de imagen inválido'
        });
      }

      const updatedImages = post.images.filter((_, index) => index !== imageIndex);

      const updatedPost = await post.update({
        images: updatedImages
      });

      // Format the response
      const formattedPost = {
        ...updatedPost.get({ plain: true }),
        images: updatedImages.map(image => `http://localhost:5000${image}`)
      };

      return res.json({
        message: 'Imagen eliminada con éxito',
        data: formattedPost
      });
    } catch (error) {
      console.error('Error al eliminar imagen:', error);
      return res.status(500).json({
        message: 'Error al eliminar la imagen',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }
}