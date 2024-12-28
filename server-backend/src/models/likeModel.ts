import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database/sequelize';
import User from './userModel';
import Post from './postModel';

class Like extends Model {
  public id!: number;
  public postId!: string;
  public userId!: number;

  // Método de clase para obtener la cantidad de likes de un post
  public static async getLikesByPost(postId: string): Promise<number> {
    const likes = await Like.count({ where: { postId } });
    return likes;
  }

  // Método para definir las asociaciones
  static associate() {
    Like.belongsTo(User, { foreignKey: 'userId' });
    Like.belongsTo(Post, { foreignKey: 'postId' });
    User.hasMany(Like, { foreignKey: 'userId' });
    Post.hasMany(Like, { foreignKey: 'postId' });
  }
}

Like.init({
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
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
}, {
  sequelize,
  modelName: 'Like',
  tableName: 'likes',
  timestamps: false,
});

export default Like;
