import { Request } from 'express';
import { IUser } from '../interfaces';

export interface AuthUser {
  userId: string;
  role: string;
  email: string;
  name: string;
}

export interface AuthResponse {
  userId: string;
  role: string;
  name?: string;
  token: string;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
  file?: Express.Multer.File;
}

export interface ApiResponse<T = any> {
  message: string;
  data?: T;
  error?: any;
}