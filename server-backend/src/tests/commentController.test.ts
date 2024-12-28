import { Request, Response } from 'express';
import { createComment, getCommentsByPostId } from '../controllers/commentController';
import Comment from '../models/commentModel';
import User from '../models/userModel';

// Mockear modelos
jest.mock('../models/commentModel');
jest.mock('../models/userModel');

// Factory function para crear un comentario simulado
const mockComment = (overrides = {}) => ({
  id: 1,
  content: 'Este es un comentario',
  userId: '456',
  postId: '123e4567-e89b-12d3-a456-426614174000',
  created_at: new Date(),
  user: { name: 'Test User' },
  ...overrides,
});

describe('Comment Controller', () => {
  describe('createComment', () => {
    it('debería crear un comentario', async () => {
      const req = {
        params: { postId: '123e4567-e89b-12d3-a456-426614174000' },
        user: { userId: '456' },
        body: { content: 'Este es un comentario' }
      } as unknown as Request;

      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

      (Comment.create as jest.Mock).mockResolvedValue(mockComment());

      await createComment(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ content: 'Este es un comentario' }));
    });
  });

  describe('getCommentsByPostId', () => {
    it('debería obtener los comentarios de un post', async () => {
      const req = { params: { postId: '123e4567-e89b-12d3-a456-426614174000' } } as unknown as Request;
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

      // Simular la respuesta de Comment.findAll
      (Comment.findAll as jest.Mock).mockResolvedValue([mockComment()]);

      await getCommentsByPostId(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([
        expect.objectContaining({
          id: 1,
          content: 'Este es un comentario',
          userId: '456',
          postId: '123e4567-e89b-12d3-a456-426614174000',
          created_at: expect.any(Date),
          username: 'Test User'
        })
      ]));
    });
  });
});
