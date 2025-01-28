// types/mongoBaseModel.ts
import { Types } from 'mongoose';

export interface MongoBaseModel {
  _id?: Types.ObjectId;
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}