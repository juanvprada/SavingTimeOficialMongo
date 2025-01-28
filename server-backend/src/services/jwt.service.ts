import jwt from 'jsonwebtoken';
import { IUser } from '../interfaces';
import { TokenPayload } from '../types/token.types';

const JWT_SECRET = process.env.JWT_SECRET || '1234'; // Mejor usar variable de entorno
const JWT_EXPIRES_IN = '1h';

export class JwtService {
  static generateToken(payload: TokenPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  }
}