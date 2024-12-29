import { UUID, Timestamp, BaseModel } from '../types';

export interface IUser extends BaseModel {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface IPost extends BaseModel {
  name: string;
  kindOfPost: PostType;
  description: string;
  images: string[] | null;
  userId: UUID;
}

// Actualizamos ILike para extender de BaseModel y usar UUID para id
export interface ILike extends BaseModel {
  postId: UUID;
  userId: UUID;
  post?: IPost;
  user?: IUser;
}

// Actualizamos IComment para extender de BaseModel y usar UUID para id
export interface IComment extends BaseModel {
  postId: UUID;
  userId: UUID;
  content: string;
  post?: IPost;
  user?: IUser;
  created_at?: Date;
  updated_at?: Date;
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