import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/userModel';
import { AuthService } from '../services/auth.service';
import { ApiResponse, AuthResponse, AuthRequest } from '../types/request.types';
import { IUser } from '../interfaces';
import { CONFIG } from '../config/constants';

export class UserController {
  static async register(req: Request, res: Response<ApiResponse<AuthResponse>>) {
    const { name, email, password } = req.body;

    try {
      // Check if email already exists
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({
          message: 'Este email ya está registrado'
        });
      }

      // Create new user
      const hashedPassword = await AuthService.hashPassword(password);
      const newUser = await User.create({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        role: 'user' // Default role
      });

      // Generate token
      const token = AuthService.generateToken({
        userId: newUser._id.toString(),
        role: newUser.role,
        email: newUser.email,
        name: newUser.name,
      });

      return res.status(201).json({
        message: 'Usuario registrado con éxito',
        data: {
          userId: newUser._id.toString(),
          role: newUser.role,
          name: newUser.name,
          token,
        },
      });
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      return res.status(500).json({
        message: 'Error al registrar el usuario, por favor intente nuevamente',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  static async login(req: Request, res: Response<ApiResponse<AuthResponse>>) {
    const { email, password } = req.body;
  
    try {
      console.log('Login attempt for:', email);
  
      const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  
      if (!user) {
        console.log('User not found:', email);
        return res.status(401).json({
          message: 'Credenciales inválidas',
        });
      }
  
      const isValidPassword = await AuthService.comparePasswords(password, user.password);
      
      if (!isValidPassword) {
        console.log('Invalid password for user:', email);
        return res.status(401).json({
          message: 'Credenciales inválidas',
        });
      }
  
      const token = AuthService.generateToken({
        userId: user._id.toString(),
        role: user.role,
        email: user.email,
        name: user.name,
      });
  
      console.log('Login successful for:', email);
  
      // Asegurar que todos los headers necesarios estén presentes
      res.set({
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Expose-Headers': 'Authorization'
      });
  
      return res.status(200).json({
        message: 'Inicio de sesión exitoso',
        data: {
          userId: user._id.toString(),
          role: user.role,
          name: user.name,
          token,
        },
      });
    } catch (error) {
      console.error('Error en login:', error);
      return res.status(500).json({
        message: 'Error al iniciar sesión',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  static async getAll(req: Request, res: Response<ApiResponse<IUser[]>>) {
    try {
      const users = await User.find({}, 'email role');

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
      const user = await User.findById(id).select('-password');

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
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
      ).select('-password');

      if (!updatedUser) {
        return res.status(404).json({
          message: 'Usuario no encontrado'
        });
      }

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
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({
          message: 'Usuario no encontrado',
        });
      }

      const token = jwt.sign(
        { userId: user._id.toString() }, // Convertir ObjectId a string
        CONFIG.JWT.SECRET,
        { expiresIn: '2h' }
      );

      return res.status(200).json({
        message: 'Token de recuperación generado exitosamente',
        data: { token },
      });
    } catch (error) {
      console.error('Error al generar token de recuperación:', error);
      return res.status(500).json({
        message: 'Error al generar token de recuperación',
        error,
      });
    }
  }

  static async resetPassword(req: Request, res: Response) {
    const { token, password } = req.body;

    try {
      const decoded = jwt.verify(token, CONFIG.JWT.SECRET) as { userId: string };
      const user = await User.findById(decoded.userId);

      if (!user) {
        return res.status(404).json({
          message: 'Usuario no encontrado',
        });
      }

      const hashedPassword = await AuthService.hashPassword(password);
      await User.findByIdAndUpdate(user._id, { password: hashedPassword });

      return res.status(200).json({
        message: 'Contraseña restablecida exitosamente',
      });
    } catch (error) {
      console.error('Error al restablecer contraseña:', error);
      return res.status(400).json({
        message: 'Token inválido o expirado',
        error,
      });
    }
  }

  static async getProfile(req: AuthRequest, res: Response) {
    const userId = req.user?.userId;

    try {
      const user = await User.findById(userId).select('-password');

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






