import { Document, Schema } from 'mongoose';

export interface BaseModel extends Document {
  created_at: Date;
  updated_at: Date;
}

export const baseModelSchema = new Schema({
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});