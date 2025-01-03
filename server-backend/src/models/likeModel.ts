import { DataTypes } from 'sequelize';
import { sequelize } from '../database/sequelize';
import { BaseSequelizeModel, baseModelConfig } from './BaseModel';
import { ILike } from '../interfaces';
import { UUID } from '../types';

export class Like extends BaseSequelizeModel<ILike> {
  public postId!: UUID;
  public userId!: UUID;

  public static async getLikesByPost(postId: UUID): Promise<number> {
    return await Like.count({ where: { postId } });
  }

  public static associate(): void {
    const { User, Post } = require('./index');
    Like.belongsTo(User, {
      foreignKey: 'userId',
      as: 'user'
    });
    Like.belongsTo(Post, {
      foreignKey: 'postId',
      as: 'post'
    });
  }
}

Like.init({
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
    }
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
  hooks: {
    beforeCreate: (like) => {
      console.log('Creating like:', like.toJSON());
    },
    beforeDestroy: (like) => {
      console.log('Destroying like:', like.toJSON());
    }
  },
  ...baseModelConfig,
  sequelize,
  modelName: 'Like',
  tableName: 'likes',
  timestamps: false  // Add this line
});
export default Like;