import jwt from 'jsonwebtoken';
import { IUser } from '../interfaces';

const JWT_SECRET = process.env.JWT_SECRET || '1234'; // Mejor usar variable de entorno
const JWT_EXPIRES_IN = '1h';

export class JwtService {
  static generateToken(user: Partial<IUser>): string {
    return jwt.sign(
      {
        userId: user.id,
        role: user.role,
        email: user.email,
        name: user.name
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
  }
}