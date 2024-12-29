import { DataTypes } from 'sequelize';
import { sequelize } from '../database/sequelize';
import { BaseSequelizeModel, baseModelConfig } from './BaseModel';
import { IPost, PostType } from '../interfaces';
import { UUID } from '../types';

export class Post extends BaseSequelizeModel<IPost> {
  public name!: string;
  public kindOfPost!: PostType;
  public description!: string;
  public image?: string;
  public userId!: UUID;

  public static associate(models: any): void {
    const { User, Comment, Like } = models; 
    Post.belongsTo(User, {
      foreignKey: 'userId',
      as: 'user'
    });
    Post.hasMany(Comment, {
      foreignKey: 'postId',
      as: 'comments',
      onDelete: 'CASCADE'
    });
    Post.hasMany(Like, {
      foreignKey: 'postId',
      as: 'likes',
      onDelete: 'CASCADE'
    });
  }
}

Post.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 255]
    }
  },
  kindOfPost: { 
    type: DataTypes.ENUM(...Object.values(PostType)),
    allowNull: false,
    validate: {
      isIn: [Object.values(PostType)]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  userId: { 
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  ...baseModelConfig,
  sequelize,
  modelName: 'Post',
  tableName: 'posts',
  underscored: false 
});

export default Post;

