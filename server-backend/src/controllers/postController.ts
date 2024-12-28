import { Request, Response } from 'express';
import Post from '../models/postModel';
import { v4 as uuidv4 } from 'uuid';
console.log(uuidv4()); 

//=====================
// Crear un nuevo post
//=====================
export const createPost = async (req: Request, res: Response) => {
  const { name, kindOfPost, description } = req.body;
  const imagePath = req.file?.path ? req.file.path.replace(/\\/g, '/') : '';
  const imageName = imagePath.split('/').pop();
  const image = imageName ? `http://localhost:5000/uploads/${imageName}` : '';

  if (!name || !kindOfPost || !description || !image) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  try {
    const newPost = await Post.create({ id: uuidv4(), name, kindOfPost, description, image });
    res.status(201).json({ message: 'Post creado con éxito', post: newPost });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el post', error });
  }
};

//===========================
// Obtener un post por su ID
//===========================
export const getPostById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const post = await Post.findByPk(id);

    if (!post) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el post', error });
  }
};

//====================
// Actualizar un post
//====================
export const updatePost = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, kindOfPost, description } = req.body;
  const image = req.file ? `http://localhost:5000/uploads/${req.file.filename}` : undefined;

  try {
    const post = await Post.findByPk(id);

    if (!post) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }

    const updatedPost = await post.update({ name, kindOfPost, description, image: image || post.image });

    res.json({ message: 'Post actualizado con éxito', post: updatedPost });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el post', error });
  }
};

//==================
// Eliminar un post
//==================
export const deletePost = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const post = await Post.findByPk(id);

    if (!post) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }

    await post.destroy();
    res.json({ message: 'Post eliminado con éxito' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el post', error });
  }
};

//=========================
// Obtener todos los posts
//=========================
export const getPosts = async (req: Request, res: Response) => {
  try {
    const posts = await Post.findAll();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener posts', error });
  }
};





