import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database/sequelize';

class Post extends Model {
  public id!: string;
  public name!: string;
  public kindOfPost!: string;
  public description!: string;
  public image?: string;

  // Método para definir las asociaciones
  static associate() {
    const Comment = require('./commentModel').default;
    const Like = require('./likeModel').default;
    Post.hasMany(Comment, { foreignKey: 'postId' });
    Post.hasMany(Like, { foreignKey: 'postId' });
    Comment.belongsTo(Post, { foreignKey: 'postId' });
    Like.belongsTo(Post, { foreignKey: 'postId' });
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
  },
  kindOfPost: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
  },
}, {
  sequelize,
  modelName: 'Post',
  tableName: 'posts',
  timestamps: false,
});

export default Post;

