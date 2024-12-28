import { config } from "dotenv";

config();

export const DB_PASSWORD =<string> process.env.DB_PASSWORD;
export const DB_HOST = process.env.DB_HOST;
export const DB_USER = <string> process.env.DB_USER;
export const DB_DEV_NAME = <string> process.env.DB_DEV_NAME;
export const DB_PORT = process.env.DB_PORT;
export const PORT = process.env.PORT;
export const JWT_SECRET= process.env.JWT_SECRET;

// export const CLOUD_NAME = process.env.VITE_CLOUDINARY_CLOUD_NAME;
// export const API_KEY = process.env.VITE_CLOUDINARY_API_KEY;
export const PRESET = process.env.VITE_CLOUDINARY_PRESET;
export const DB_TEST_NAME =<string> process.env.DB_TEST_NAME;
export const NODE_ENV = process.env.NODE_ENV;