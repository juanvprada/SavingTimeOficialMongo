import { DataTypes } from 'sequelize';
import { sequelize } from '../database/sequelize';
import { BaseSequelizeModel, baseModelConfig } from './BaseModel';
import { IUser, UserRole } from '../interfaces';

export class User extends BaseSequelizeModel<IUser> {
  public name!: string;
  public email!: string;
  public password!: string;
  public role!: UserRole;

  public static associate(): void {
    const { Comment, Like, Post } = require('./index');
    User.hasMany(Post, { 
      foreignKey: 'userId',
      as: 'posts' 
    });
    User.hasMany(Comment, { 
      foreignKey: 'userId',
      as: 'comments' 
    });
    User.hasMany(Like, { 
      foreignKey: 'userId',
      as: 'likes' 
    });
  }
}

User.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 100]
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [6, 255]
    }
  },
  role: {
    type: DataTypes.ENUM(...Object.values(UserRole)),
    allowNull: false,
    defaultValue: UserRole.USER
  }
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users',
  underscored: true, 
  timestamps: true, 
  indexes: [
    {
      unique: true,
      fields: ['email']
    }
  ]
});