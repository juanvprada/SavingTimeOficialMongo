"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comment = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = require("../database/sequelize");
const BaseModel_1 = require("./BaseModel");
class Comment extends BaseModel_1.BaseSequelizeModel {
    static associate() {
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
exports.Comment = Comment;
Comment.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    postId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'posts',
            key: 'id'
        },
        field: 'postId'
    },
    userId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        },
        field: 'userId'
    },
    content: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [1, 1000]
        }
    },
    created_at: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    updated_at: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    }
}, Object.assign(Object.assign({}, BaseModel_1.baseModelConfig), { sequelize: sequelize_2.sequelize, modelName: 'Comment', tableName: 'comments', timestamps: true, underscored: true }));
exports.default = Comment;
