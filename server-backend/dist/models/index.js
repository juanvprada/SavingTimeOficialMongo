"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeAssociations = exports.Comment = exports.Like = exports.Post = exports.User = void 0;
const userModel_1 = require("./userModel");
Object.defineProperty(exports, "User", { enumerable: true, get: function () { return userModel_1.User; } });
const postModel_1 = __importDefault(require("./postModel"));
exports.Post = postModel_1.default;
const likeModel_1 = __importDefault(require("./likeModel"));
exports.Like = likeModel_1.default;
const commentModel_1 = __importDefault(require("./commentModel"));
exports.Comment = commentModel_1.default;
// Almacena modelos en un objeto para facilitar el acceso
const models = {
    User: userModel_1.User,
    Post: postModel_1.default,
    Like: likeModel_1.default,
    Comment: commentModel_1.default
};
// Inicializa asociaciones correctamente
const initializeAssociations = () => {
    Object.values(models).forEach((model) => {
        if (model.associate) {
            model.associate(models);
        }
    });
};
exports.initializeAssociations = initializeAssociations;
exports.default = models;
