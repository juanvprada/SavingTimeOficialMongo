import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { CONFIG } from '../config/constants';
import { AuthRequest, AuthUser } from '../types/request.types';

export class AuthMiddleware {
  static authenticate(req: AuthRequest, res: Response, next: NextFunction) {
    console.log('Headers:', req.headers);
    const token = req.headers.authorization?.split(' ')[1];
    console.log('Token:', token);
  
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
  
    try {
      const verified = jwt.verify(token, CONFIG.JWT.SECRET) as AuthUser;
      console.log('Verified token:', verified);
      req.user = verified;
      next();
    } catch (error) {
      console.error('Auth error:', error);
      return res.status(401).json({ message: 'Invalid token' });
    }
  }

  static authorize(roles: string[]) {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
      if (!req.user) {
        return res.status(401).json({ 
          message: 'Usuario no autenticado.' 
        });
      }

      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ 
          message: 'Acceso denegado. Rol insuficiente.' 
        });
      }

      next();
    };
  }
}