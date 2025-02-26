// postController.ts
import { Response } from 'express';
import mongoose, { Types } from 'mongoose';
import { Post } from '../models/postModel';
import { User } from '../models/userModel';
import { AuthRequest, ApiResponse } from '../types/request.types';
import { IPost, PostType, RecommendationStatus } from '../interfaces';
import { CONFIG } from '../config/constants';

export class PostController {
  static async getAll(req: AuthRequest, res: Response<ApiResponse<IPost[]>>) {
    try {
      // Filtrar por estado de recomendación si se proporciona
      const { recommendationStatus } = req.query;
      const filter: any = {};

      if (recommendationStatus && Object.values(RecommendationStatus).includes(recommendationStatus as RecommendationStatus)) {
        filter.recommendationStatus = recommendationStatus;
      }

      const posts = await Post.find(filter)
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
    console.log('Datos recibidos en el controlador create:', req.body);
    console.log('Campo recommendationStatus recibido en create:', req.body.recommendationStatus);
    try {
      const { 
        name, 
        kindOfPost, 
        description, 
        userId, 
        city, 
        price, 
        rating, 
        images,
        recommendationStatus = RecommendationStatus.NONE 
      } = req.body;
      
      const postData = {
        name: String(name),
        kindOfPost: String(kindOfPost),
        description: String(description),
        city: String(city),
        price: Number(price),
        userId: new Types.ObjectId(userId),
        rating: Number(rating),
        images: images ? (Array.isArray(images) ? images : [images]) : [],
        recommendationStatus: String(recommendationStatus)
      };
  
      console.log('URLs de imágenes recibidas:', postData.images);
      console.log('Estado de recomendación:', postData.recommendationStatus);
  
      const newPost = await Post.create(postData);
      const populatedPost = await Post.findById(newPost._id)
        .populate('userId', 'name email')
        .lean();
  
      if (!populatedPost) throw new Error('Error al crear el post');
  
      return res.status(201).json({
        message: 'Post creado con éxito',
        data: { ...populatedPost, id: populatedPost._id.toString() }
      });
  
    } catch (error) {
      console.error('Error al crear post:', error);
      return res.status(500).json({ message: 'Error al crear el post' });
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
      console.log('Datos recibidos en el controlador update:', req.body);
    console.log('Campo recommendationStatus recibido en update:', req.body.recommendationStatus);
      const { images, recommendationStatus, ...updateData } = req.body;
  
      // Procesar las imágenes
      const imageUrls = Array.isArray(images) ? images : [images].filter(Boolean);
      
      // Preparar datos de actualización
      const dataToUpdate = {
        ...updateData,
        images: imageUrls,
        recommendationStatus: recommendationStatus || RecommendationStatus.NONE
      };
  
      const updatedPost = await Post.findByIdAndUpdate(
        id,
        dataToUpdate,
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
      return res.status(500).json({ message: 'Error al actualizar el post', error });
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
  
  // Método adicional para filtrar por estado de recomendación
  static async getByRecommendationStatus(req: AuthRequest, res: Response<ApiResponse<IPost[]>>) {
    try {
      const { status } = req.params;
      
      // Validar que el estado proporcionado sea válido
      if (!Object.values(RecommendationStatus).includes(status as RecommendationStatus)) {
        return res.status(400).json({
          message: 'Estado de recomendación no válido',
          data: []
        });
      }
      
      const posts = await Post.find({ recommendationStatus: status })
        .populate('userId', 'name')
        .lean();
        
      const formattedPosts = posts.map(post => ({
        ...post,
        id: post._id.toString(),
        userId: new Types.ObjectId(
          typeof post.userId === 'object'
            ? post.userId._id
            : post.userId
        )
      })) as IPost[];
      
      return res.json({
        message: 'Posts filtrados obtenidos con éxito',
        data: formattedPosts
      });
      
    } catch (error) {
      console.error('Error al filtrar posts:', error);
      return res.status(500).json({
        message: 'Error al filtrar los posts',
        data: [],
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}