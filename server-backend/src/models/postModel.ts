// models/postModel.ts
import mongoose, { Schema } from 'mongoose';
import { IPost } from '../interfaces';
import { PostType } from '../interfaces';

const postSchema = new Schema<IPost>({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255
  },
  kindOfPost: {
    type: String,
    enum: Object.values(PostType),
    required: true
  },
  description: {
    type: String,
    required: true
  },
  images: [{
    type: String,
    default: null
  }],
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  }
}, {
  timestamps: true,
  toJSON: {
    transform: (_, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

export const Post = mongoose.model<IPost>('Post', postSchema);

