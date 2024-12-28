import { Request, Response } from 'express';
import { updateUserRole } from '../controllers/roleController';
import { db } from '../database/db';

jest.mock('../database/db');

describe('Role Controller', () => {
  describe('updateUserRole', () => {
    it('debería actualizar el rol de un usuario si es admin', async () => {
      const req = {
        user: { userId: 'adminId', role: 'admin' },
        params: { id: '123' },
        body: { role: 'editor' }
      } as unknown as Request;

      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

      (db.query as jest.Mock).mockResolvedValue([{}]);

      await updateUserRole(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Rol de usuario actualizado con éxito' }));
    });

    it('debería devolver un error si el usuario no es admin', async () => {
      const req = { user: { userId: 'userId', role: 'user' }, params: { id: '123' }, body: { role: 'editor' } } as unknown as Request;
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

      await updateUserRole(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Acceso denegado' }));
    });
  });
});
