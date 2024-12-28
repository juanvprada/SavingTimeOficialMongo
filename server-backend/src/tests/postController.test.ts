import { Request, Response } from 'express';
import { createPost, getPostById, updatePost, deletePost, getPosts } from '../controllers/postController';
import Post from '../models/postModel';

jest.mock('../models/postModel');

describe('Post Controller', () => {
  describe('createPost', () => {
    it('debería crear un nuevo post y devolverlo', async () => {
      const req = {
        body: { name: 'Nuevo Post', kindOfPost: 'Artículo', description: 'Descripción de prueba' },
        file: { path: '/uploads/test.jpg' }
      } as unknown as Request;

      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

      (Post.create as jest.Mock).mockResolvedValue({
        id: '123',
        name: 'Nuevo Post',
        kindOfPost: 'Artículo',
        description: 'Descripción de prueba',
        image: 'http://localhost:5000/uploads/test.jpg'
      });

      await createPost(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Post creado con éxito'
      }));
    });
  });

  describe('getPostById', () => {
    it('debería devolver un post por su ID', async () => {
      const req = { params: { id: '123' } } as unknown as Request;
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

      (Post.findByPk as jest.Mock).mockResolvedValue({ id: '123', name: 'Post de prueba' });

      await getPostById(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: '123' }));
    });
  });

  describe('updatePost', () => {
    it('debería actualizar un post existente', async () => {
      const req = {
        params: { id: '123' },
        body: { name: 'Post Actualizado', kindOfPost: 'Artículo', description: 'Nueva descripción' },
        file: { filename: 'new_image.jpg' }
      } as unknown as Request;

      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

      (Post.findByPk as jest.Mock).mockResolvedValue({
        id: '123',
        update: jest.fn().mockResolvedValue({
          id: '123',
          name: 'Post Actualizado',
          kindOfPost: 'Artículo',
          description: 'Nueva descripción',
          image: 'http://localhost:5000/uploads/new_image.jpg'
        })
      });

      await updatePost(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Post actualizado con éxito',
        post: expect.objectContaining({ name: 'Post Actualizado' })
      }));
    });

    it('debería devolver un error si el post no existe', async () => {
      const req = { params: { id: '123' }, body: {} } as unknown as Request;
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

      (Post.findByPk as jest.Mock).mockResolvedValue(null);

      await updatePost(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Post no encontrado' });
    });
  });

  describe('deletePost', () => {
    it('debería eliminar un post existente', async () => {
      const req = { params: { id: '123' } } as unknown as Request;
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

      (Post.findByPk as jest.Mock).mockResolvedValue({
        id: '123',
        destroy: jest.fn().mockResolvedValue({})
      });

      await deletePost(req, res);

      expect(res.json).toHaveBeenCalledWith({ message: 'Post eliminado con éxito' });
    });

    it('debería devolver un error si el post no existe', async () => {
      const req = { params: { id: '123' } } as unknown as Request;
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

      (Post.findByPk as jest.Mock).mockResolvedValue(null);

      await deletePost(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Post no encontrado' });
    });
  });

  describe('getPosts', () => {
    it('debería obtener todos los posts', async () => {
      const req = {} as Request;
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

      (Post.findAll as jest.Mock).mockResolvedValue([
        { id: '123', name: 'Post de prueba 1' },
        { id: '124', name: 'Post de prueba 2' }
      ]);

      await getPosts(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.any(Array));
    });

    it('debería manejar errores en la obtención de posts', async () => {
      const req = {} as Request;
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

      (Post.findAll as jest.Mock).mockRejectedValue(new Error('Error de base de datos'));

      await getPosts(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Error al obtener posts' }));
    });
  });
});
