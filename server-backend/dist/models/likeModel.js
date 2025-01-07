"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Like = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = require("../database/sequelize");
const BaseModel_1 = require("./BaseModel");
class Like extends BaseModel_1.BaseSequelizeModel {
    static getLikesByPost(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Like.count({ where: { postId } });
        });
    }
    static associate() {
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
exports.Like = Like;
Like.init({
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
        }
    },
    userId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    }
}, Object.assign(Object.assign({ hooks: {
        beforeCreate: (like) => {
            console.log('Creating like:', like.toJSON());
        },
        beforeDestroy: (like) => {
            console.log('Destroying like:', like.toJSON());
        }
    } }, BaseModel_1.baseModelConfig), { sequelize: sequelize_2.sequelize, modelName: 'Like', tableName: 'likes', timestamps: false // Add this line
 }));
exports.default = Like;
