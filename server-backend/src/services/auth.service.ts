// src/services/auth.service.ts
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { CONFIG } from '../config/constants';
import { AuthUser } from '../types/request.types';
import { IUser } from '../interfaces';
import { TokenPayload } from '../types/token.types';

export class AuthService {
  private static readonly SALT_ROUNDS = 10;

  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  static async comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
    try {
      console.log('Comparing passwords:', { plainPassword, hashedPassword });
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      console.error('Error comparing passwords:', error);
      return false;
    }
  }

  static generateToken(payload: TokenPayload): string {
    return jwt.sign(payload, CONFIG.JWT.SECRET, { expiresIn: CONFIG.JWT.EXPIRES_IN });
  }
}
