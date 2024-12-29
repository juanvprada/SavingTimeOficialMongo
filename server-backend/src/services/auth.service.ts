// src/services/auth.service.ts
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { CONFIG } from '../config/constants';
import { AuthUser } from '../types/request.types';
import { IUser } from '../interfaces';

export class AuthService {
  private static readonly SALT_ROUNDS = 10;

  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  static async comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
    try {
      // Agrega un log para debug
      console.log('Comparing passwords:', { plainPassword, hashedPassword });
      const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
      console.log('Password match:', isMatch);
      return isMatch;
    } catch (error) {
      console.error('Error comparing passwords:', error);
      return false;
    }
  }

  static generateToken(user: Partial<IUser>): string {
    const tokenPayload: Partial<AuthUser> = {
      userId: user.id!,
      role: user.role!,
      email: user.email!,
      name: user.name!
    };

    return jwt.sign(
      tokenPayload,
      CONFIG.JWT.SECRET,
      { expiresIn: CONFIG.JWT.EXPIRES_IN }
    );
  }
}