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
};
