import dotenv from 'dotenv';

dotenv.config();

interface DBConfig {
  HOST: string;
  USER: string;
  PASSWORD: string;
  DEV_NAME: string;
  TEST_NAME: string;
  PORT: string | number;
  URI: string;
  LOGGING: boolean;
}

interface AppConfig {
  PORT: number | string;
  JWT: {
    SECRET: string;
    EXPIRES_IN: string;
  };
  DB: DBConfig;
  UPLOAD: {
    PATH: string;
    MAX_SIZE: number;
  };
}

export const CONFIG: AppConfig = {
  PORT: process.env.PORT || 5000,
  JWT: {
    SECRET: process.env.JWT_SECRET || 'your-secret-key',
    EXPIRES_IN: '1h'
  },
  DB: {
    HOST: process.env.DB_HOST || 'localhost',
    USER: process.env.DB_USER || 'juan',
    PASSWORD: process.env.DB_PASSWORD || '1234abcd',
    DEV_NAME: process.env.DB_DEV_NAME || 'savingtimedb',
    TEST_NAME: process.env.DB_TEST_NAME || 'savingtimedb_test',
    PORT: process.env.DB_PORT || '27017',
    LOGGING: process.env.NODE_ENV !== 'production',
    URI: process.env.MONGODB_URI ||
      `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DEV_NAME}`
  },
  UPLOAD: {
    PATH: 'uploads',
    MAX_SIZE: 5 * 1024 * 1024 // 5MB
  }
} as const;