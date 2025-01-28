import { Document, Types } from 'mongoose';

export type UUID = Types.ObjectId;
export type Timestamp = Date;

// Base interface para todos los modelos
export interface BaseModel extends Document {
  _id: UUID;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// Enums
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user'
}

export enum PostType {
  BLOG = 'blog',
  NEWS = 'news',
  TUTORIAL = 'tutorial'
}