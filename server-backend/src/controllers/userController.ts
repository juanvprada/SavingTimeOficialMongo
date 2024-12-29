import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models';
import { AuthService } from '../services/auth.service';
import { ApiResponse, AuthResponse, AuthRequest } from '../types/request.types';
import { IUser } from '../interfaces';
import { CONFIG } from '../config/constants';

export class UserController {
  static async register(req: Request, res: Response<ApiResponse<AuthResponse>>) {
    const { name, email, password, role = 'user' } = req.body;

    try {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ 
          message: 'El usuario ya existe' 
        });
      }

      const hashedPassword = await AuthService.hashPassword(password);
      const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        role,
      });

      const token = AuthService.generateToken(newUser);

      return res.status(201).json({
        message: 'Usuario registrado con éxito',
        data: {
          userId: newUser.id,
          role: newUser.role,
          name: newUser.name,
          token
        }
      });
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      return res.status(500).json({
        message: 'Error al registrar el usuario',
        error
      });
    }
  }

  static async login(req: Request, res: Response<ApiResponse<AuthResponse>>) {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ 
        where: { email },
        attributes: ['id', 'name', 'email', 'password', 'role']
      });
  
      if (!user || !(await AuthService.comparePasswords(password, user.password))) {
        return res.status(401).json({
          message: 'Credenciales inválidas'
        });
      }
  
      const token = AuthService.generateToken(user);
  
      // Añade console.log para debug
      console.log('Enviando respuesta:', {
        userId: user.id,
        role: user.role,
        name: user.name,
        token
      });
  
      return res.json({
        message: 'Inicio de sesión exitoso',
        data: {
          userId: user.id,  
          role: user.role,
          name: user.name,
          token
        }
      });
    } catch (error) {
      console.error('Error en login:', error);
      return res.status(500).json({
        message: 'Error al iniciar sesión',
        error
      });
    }
  }

  static async getAll(req: Request, res: Response<ApiResponse<IUser[]>>) {
    try {
      const users = await User.findAll({
        attributes: ['id', 'email', 'role']
      });

      return res.json({
        message: 'Usuarios obtenidos con éxito',
        data: users
      });
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      return res.status(500).json({
        message: 'Error al obtener usuarios',
        error
      });
    }
  }
  static async getById(req: Request, res: Response<ApiResponse<IUser>>) {
    const { id } = req.params;
  
    try {
      const user = await User.findByPk(id, {
        attributes: ['id', 'name', 'email', 'role']
      });
  
      if (!user) {
        return res.status(404).json({
          message: 'Usuario no encontrado'
        });
      }
  
      return res.json({
        message: 'Usuario encontrado',
        data: user
      });
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      return res.status(500).json({
        message: 'Error al obtener usuario',
        error
      });
    }
  }
  
  static async update(req: Request, res: Response<ApiResponse<IUser>>) {
    const { id } = req.params;
    const updateData = req.body;
  
    try {
      const user = await User.findByPk(id);
  
      if (!user) {
        return res.status(404).json({
          message: 'Usuario no encontrado'
        });
      }
  
      const updatedUser = await user.update(updateData);
  
      return res.json({
        message: 'Usuario actualizado exitosamente',
        data: updatedUser
      });
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      return res.status(500).json({
        message: 'Error al actualizar usuario',
        error
      });
    }
  }
  static async recoverPassword(req: Request, res: Response) {
    const { email } = req.body;

    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ 
          message: 'Usuario no encontrado' 
        });
      }

      const token = jwt.sign(
        { userId: user.id },
        CONFIG.JWT.SECRET,
        { expiresIn: '2h' }
      );
      
      return res.status(200).json({
        message: 'Token de recuperación generado exitosamente',
        data: { token }
      });
    } catch (error) {
      console.error('Error al generar token de recuperación:', error);
      return res.status(500).json({
        message: 'Error al generar token de recuperación',
        error
      });
    }
  }

  static async resetPassword(req: Request, res: Response) {
    const { token, password } = req.body;

    try {
      const decoded = jwt.verify(token, CONFIG.JWT.SECRET) as { userId: string };
      const user = await User.findByPk(decoded.userId);

      if (!user) {
        return res.status(404).json({ 
          message: 'Usuario no encontrado' 
        });
      }

      const hashedPassword = await AuthService.hashPassword(password);
      await user.update({ password: hashedPassword });

      return res.status(200).json({
        message: 'Contraseña restablecida exitosamente'
      });
    } catch (error) {
      console.error('Error al restablecer contraseña:', error);
      return res.status(400).json({
        message: 'Token inválido o expirado',
        error
      });
    }
  }

  static async getProfile(req: AuthRequest, res: Response) {
    const userId = req.user?.userId;

    try {
      const user = await User.findByPk(userId, {
        attributes: ['id', 'name', 'email', 'role']
      });

      if (!user) {
        return res.status(404).json({ 
          message: 'Usuario no encontrado' 
        });
      }

      return res.json({
        message: 'Perfil obtenido exitosamente',
        data: user
      });
    } catch (error) {
      console.error('Error al obtener perfil:', error);
      return res.status(500).json({
        message: 'Error al obtener perfil',
        error
      });
    }
  }
}







