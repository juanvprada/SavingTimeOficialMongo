import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database/sequelize';
import User from './userModel';
import Post from './postModel';

class Comment extends Model {
  public id!: number;
  public postId!: string;
  public userId!: string;
  public content!: string;
  public created_at!: Date;

  static associate() {
    Comment.belongsTo(User, { foreignKey: 'userId', as: 'user' });
    Comment.belongsTo(Post, { foreignKey: 'postId' });
  }
}

Comment.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  postId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Post,
      key: 'id',
    },
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  sequelize,
  modelName: 'Comment',
  tableName: 'comments',
  timestamps: false,
});

export default Comment;
