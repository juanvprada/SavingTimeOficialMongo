import dotenv from 'dotenv';

dotenv.config();

export const CONFIG = {
  PORT: process.env.PORT || 5000,
  JWT: {
    SECRET: process.env.JWT_SECRET || 'your-secret-key',
    EXPIRES_IN: '1h'
  },
  DB: {
    HOST: process.env.DB_HOST || 'localhost',
    USER: process.env.DB_USER || 'root',
    PASSWORD: process.env.DB_PASSWORD || '',
    NAME: process.env.DB_NAME || 'savingtime',
    PORT: parseInt(process.env.DB_PORT || '3306'),
    LOGGING: process.env.NODE_ENV !== 'production'
  },
  UPLOAD: {
    PATH: 'uploads',
    MAX_SIZE: 5 * 1024 * 1024 // 5MB
  }
} as const;