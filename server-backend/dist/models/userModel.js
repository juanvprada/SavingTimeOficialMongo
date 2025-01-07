"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = require("../database/sequelize");
const BaseModel_1 = require("./BaseModel");
const interfaces_1 = require("../interfaces");
class User extends BaseModel_1.BaseSequelizeModel {
    static associate() {
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
exports.User = User;
User.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [2, 100]
        }
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [6, 255]
        }
    },
    role: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(interfaces_1.UserRole)),
        allowNull: false,
        defaultValue: interfaces_1.UserRole.USER
    }
}, {
    sequelize: sequelize_2.sequelize,
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
