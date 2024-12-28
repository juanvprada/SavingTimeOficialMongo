import { Request, Response } from 'express';
import { toggleLike } from '../controllers/likeController';
import Like from '../models/likeModel';

jest.mock('../models/likeModel');

describe('Like Controller', () => {
  describe('toggleLike', () => {
    it('debería agregar un like si no existe', async () => {
      const req = {
        params: { postId: '123' },
        user: { userId: '456' }
      } as unknown as Request;

      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

      (Like.findOne as jest.Mock).mockResolvedValue(null);
      (Like.create as jest.Mock).mockResolvedValue({ postId: '123', userId: '456' });

      await toggleLike(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ liked: true }));
    });

    it('debería eliminar un like si ya existe', async () => {
      const req = { params: { postId: '123' }, user: { userId: '456' } } as unknown as Request;
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

      (Like.findOne as jest.Mock).mockResolvedValue({ destroy: jest.fn() });

      await toggleLike(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ liked: false }));
    });
  });
});
