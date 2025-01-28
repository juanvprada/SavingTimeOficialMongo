// models/likeModel.ts
import mongoose, { Schema } from 'mongoose';
import { ILike } from '../interfaces';

const likeSchema = new Schema<ILike>({
  postId: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
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

// Índice compuesto para evitar duplicados
likeSchema.index({ postId: 1, userId: 1 }, { unique: true });

// Método estático para contar likes
likeSchema.statics.getLikesByPost = async function(postId: string) {
  return this.countDocuments({ postId });
};

export const Like = mongoose.model<ILike>('Like', likeSchema);