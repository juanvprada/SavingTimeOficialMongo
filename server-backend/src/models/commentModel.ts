import { DataTypes } from 'sequelize';
import { sequelize } from '../database/sequelize';
import { BaseSequelizeModel, baseModelConfig } from './BaseModel';
import { IComment } from '../interfaces';
import { UUID } from '../types';

export class Comment extends BaseSequelizeModel<IComment> {
  public postId!: UUID;
  public userId!: UUID;
  public content!: string;
  public created_at!: Date;
  public updated_at!: Date;

  public static associate(): void {
    const { User, Post } = require('./index');
    Comment.belongsTo(User, { 
      foreignKey: 'userId',
      as: 'user'
    });
    Comment.belongsTo(Post, { 
      foreignKey: 'postId',
      as: 'post'
    });
  }
}

Comment.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  postId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'posts',
      key: 'id'
    },
    field: 'postId'
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    field: 'userId'
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 1000]
    }
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
  }
}, {
  ...baseModelConfig,
  sequelize,
  modelName: 'Comment',
  tableName: 'comments',
  timestamps: true,
  underscored: true,
});

export default Comment;