"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = require("../database/sequelize");
const BaseModel_1 = require("./BaseModel");
const interfaces_1 = require("../interfaces");
class Post extends BaseModel_1.BaseSequelizeModel {
    static associate(models) {
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
exports.Post = Post;
Post.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [2, 255]
        }
    },
    kindOfPost: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(interfaces_1.PostType)),
        allowNull: false,
        validate: {
            isIn: [Object.values(interfaces_1.PostType)]
        }
    },
    description: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    image: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    images: {
        type: sequelize_1.DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
        get() {
            const imagesValue = this.getDataValue('images');
            const singleImage = this.getDataValue('image');
            if (imagesValue) {
                return Array.isArray(imagesValue) ? imagesValue : [];
            }
            else if (singleImage) {
                return [singleImage];
            }
            return [];
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
}, Object.assign(Object.assign({}, BaseModel_1.baseModelConfig), { sequelize: sequelize_2.sequelize, modelName: 'Post', tableName: 'posts', underscored: false }));
// Añadir hook para asegurar que images siempre sea un array
Post.addHook('afterFind', (findResult) => {
    if (!Array.isArray(findResult))
        findResult = [findResult];
    for (const instance of findResult) {
        if (instance) {
            const imagesValue = instance.getDataValue('images');
            const singleImage = instance.getDataValue('image');
            if (!imagesValue || !Array.isArray(imagesValue)) {
                instance.setDataValue('images', singleImage ? [singleImage] : []);
            }
        }
    }
});
exports.default = Post;
