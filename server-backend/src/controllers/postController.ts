// postController.ts
import { Response } from 'express';
import mongoose, { Types } from 'mongoose';
import { Post } from '../models/postModel';
import { User } from '../models/userModel';
import { AuthRequest, ApiResponse } from '../types/request.types';
import { IPost, PostType } from '../interfaces';
import { CONFIG } from '../config/constants';

export class PostController {
  static async getAll(req: AuthRequest, res: Response<ApiResponse<IPost[]>>) {
    try {
      const posts = await Post.find()
        .populate('userId', 'name')
        .lean();

      const formattedPosts = posts.map(post => ({
        ...post,
        id: post._id.toString(), // Convertir ObjectId a string
        userId: new Types.ObjectId(
          typeof post.userId === 'object'
            ? post.userId._id
            : post.userId
        )
      })) as IPost[];

      return res.json({
        message: 'Posts obtenidos con éxito',
        data: formattedPosts
      });
    } catch (error) {
      console.error('Error al obtener posts:', error);
      return res.status(500).json({
        message: 'Error al obtener los posts',
        data: [],
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }


  static async create(req: AuthRequest, res: Response<ApiResponse<IPost>>) {
    try {
      console.log("📥 Recibiendo nueva solicitud de creación de post...");
      console.log("📝 Request body:", req.body);
      console.log("🖼 Archivos recibidos en `req.files`:", req.files);
  
      const { name, kindOfPost, description, userId, city, price, rating } = req.body;
  
      const postData = {
        name: String(name),
        kindOfPost: String(kindOfPost),
        description: String(description),
        city: String(city),
        price: Number(price),
        userId: new Types.ObjectId(userId),
        images: [] as string[],
        rating: Number(rating),
      };
  
      if (req.files && Array.isArray(req.files)) {
        const files = req.files as Express.Multer.File[];
        postData.images = files.map(file => file.path); // Guardar la URL de Cloudinary
        console.log("✅ Imágenes guardadas en postData:", postData.images);
      } else {
        console.warn("⚠️ No se recibieron archivos en req.files");
      }
  
      const newPost = await Post.create(postData);
      const populatedPost = await Post.findById(newPost._id)
        .populate('userId', 'name email')
        .lean();
  
      if (!populatedPost) {
        throw new Error('Error al crear el post');
      }
  
      return res.status(201).json({
        message: 'Post creado con éxito',
        data: { ...populatedPost, id: populatedPost._id.toString() }
      });
  
    } catch (error) {
      console.error('❌ Error al crear post:', error);
      return res.status(500).json({ message: 'Error al crear el post',});
    }
  }
  


  static async getById(req: AuthRequest, res: Response<ApiResponse<IPost>>) {
    const { id } = req.params;

    try {
      const post = await Post.findById(id).populate('userId', 'name');
      if (!post) {
        return res.status(404).json({
          message: 'Post no encontrado'
        });
      }

      return res.json({
        message: 'Post encontrado',
        data: post
      });
    } catch (error) {
      console.error('Error al obtener post:', error);
      return res.status(500).json({
        message: 'Error al obtener el post',
        error
      });
    }
  }

  static async update(req: AuthRequest, res: Response<ApiResponse<IPost>>) {
    try {
      const { id } = req.params;
      const updateData = { ...req.body };
      const files = req.files as Express.Multer.File[];

      const currentPost = await Post.findById(id);
      if (!currentPost) {
        return res.status(404).json({ message: 'Post no encontrado' });
      }

      let images = currentPost.images || [];

      // Procesar existingImages primero
      if (updateData.existingImages) {
        images = Array.isArray(updateData.existingImages)
          ? updateData.existingImages
          : [updateData.existingImages];
      }

      // Añadir nuevas imágenes
      if (files?.length) {
        const newImages = files.map(file => file.filename);
        if (images.length > 0) {
          images = [...images, ...newImages];
        } else {
          images = newImages;
        }
      }

      updateData.images = images;
      delete updateData.existingImages;

      const updatedPost = await Post.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      ).populate('userId', 'name');

      if (!updatedPost) {
        return res.status(404).json({ message: 'Error al actualizar el post' });
      }

      return res.json({
        message: 'Post actualizado con éxito',
        data: updatedPost.toObject() as IPost
      });
    } catch (error) {
      console.error('Error al actualizar post:', error);
      return res.status(500).json({
        message: 'Error al actualizar el post',
        error
      });
    }
  }
  static async delete(req: AuthRequest, res: Response<ApiResponse>) {
    const { id } = req.params;

    try {
      const post = await Post.findByIdAndDelete(id);

      if (!post) {
        return res.status(404).json({
          message: 'Post no encontrado'
        });
      }

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
}