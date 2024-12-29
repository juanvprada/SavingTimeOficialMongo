import { Request } from 'express';
import { IUser } from '../interfaces';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
    email: string;
    name: string;
  };
}

export interface ApiResponse<T = any> {
  message: string;
  data?: T;
  error?: any;
}