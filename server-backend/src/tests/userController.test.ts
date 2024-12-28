import { Request, Response } from 'express';
import { registerUser, loginUser, getAllUsers } from '../controllers/userController';
import User from '../models/userModel';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

jest.mock('../models/userModel');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('User Controller', () => {
  describe('registerUser', () => {
    it('debería registrar un nuevo usuario y devolver un token', async () => {
      const req = {
        body: {
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User',
          username: 'testuser',
          role: 'user'
        }
      } as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;

      (User.findOne as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      (User.create as jest.Mock).mockResolvedValue({
        id: '123',
        email: 'test@example.com',
        name: 'Test User',
        username: 'testuser',
        role: 'user'
      });
      (jwt.sign as jest.Mock).mockReturnValue('mockToken');

      await registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Usuario registrado con éxito',
        token: 'mockToken'
      }));
    });
  });

  describe('loginUser', () => {
    it('debería iniciar sesión y devolver un token', async () => {
      const req = {
        body: {
          email: 'test@example.com',
          password: 'password123'
        }
      } as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;

      (User.findOne as jest.Mock).mockResolvedValue({
        id: '123',
        email: 'test@example.com',
        password: 'hashedPassword',
        role: 'user',
        name: 'Test User'
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue('mockToken');

      await loginUser(req, res);

      expect(res.status).not.toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Inicio de sesión exitoso',
        token: 'mockToken'
      }));
    });
  });

  describe('getAllUsers', () => {
    it('debería obtener todos los usuarios', async () => {
      const req = {} as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;

      (User.findAll as jest.Mock).mockResolvedValue([
        { id: '123', email: 'test@example.com', role: 'user' }
      ]);

      await getAllUsers(req, res);

      expect(res.json).toHaveBeenCalledWith([
        { id: '123', email: 'test@example.com', role: 'user' }
      ]);
    });
  });
});
