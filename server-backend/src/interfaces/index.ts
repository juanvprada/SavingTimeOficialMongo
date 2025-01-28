// interfaces/index.ts
import { Types } from 'mongoose';
import { MongoBaseModel } from '../types/mongoBaseModel';

export interface IUser extends MongoBaseModel {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface IPost extends MongoBaseModel {
  name: string;
  kindOfPost: PostType;
  description: string;
  images: string[] | null;
  userId: Types.ObjectId;
  city: string;
  price: number;
  rating: number;
}

export interface ILike extends MongoBaseModel {
  postId: Types.ObjectId;
  userId: Types.ObjectId;
  post?: IPost;
  user?: IUser;
}

export interface IComment extends MongoBaseModel {
  postId: Types.ObjectId;
  userId: Types.ObjectId;
  content: string;
  post?: IPost;
  user?: IUser;
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user'
}

export enum PostType {
  Bar = 'Bar',
  Restaurante = 'Restaurante',
  Alojamiento = 'Alojamiento',
  Musical = 'Musical',
  Teatro = 'Teatro',
  Lugar = 'Lugar',
  Evento = 'Evento',
}