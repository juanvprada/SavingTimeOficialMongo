"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONFIG = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.CONFIG = {
    PORT: process.env.PORT || 5000,
    JWT: {
        SECRET: process.env.JWT_SECRET || 'your-secret-key',
        EXPIRES_IN: '1h'
    },
    DB: {
        HOST: process.env.MYSQLHOST || process.env.DB_HOST || 'localhost',
        USER: process.env.MYSQLUSER || process.env.DB_USER || 'root',
        PASSWORD: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || '',
        NAME: process.env.MYSQLDATABASE || process.env.DB_NAME || 'savingtime',
        PORT: parseInt(process.env.MYSQLPORT || process.env.DB_PORT || '3306'),
        LOGGING: process.env.NODE_ENV !== 'production'
    },
    UPLOAD: {
        PATH: 'uploads',
        MAX_SIZE: 5 * 1024 * 1024 // 5MB
    }
};
