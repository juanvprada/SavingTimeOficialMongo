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
exports.LikeController = void 0;
const likeModel_1 = require("../models/likeModel");
class LikeController {
    static toggle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { postId } = req.params;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
            try {
                const existingLike = yield likeModel_1.Like.findOne({ postId, userId });
                if (existingLike) {
                    yield likeModel_1.Like.deleteOne({ _id: existingLike._id });
                    return res.json({ data: { liked: false } });
                }
                yield likeModel_1.Like.create({ postId, userId });
                return res.json({ data: { liked: true } });
            }
            catch (error) {
                console.error('Error al manejar like:', error);
                return res.status(500).json({
                    message: 'Error al manejar el like'
                });
            }
        });
    }
    static getLikeCount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { postId } = req.params;
            try {
                const count = yield likeModel_1.Like.countDocuments({ postId });
                return res.json({
                    message: 'Conteo de likes obtenido',
                    data: { count }
                });
            }
            catch (error) {
                console.error('Error al obtener conteo de likes:', error);
                return res.status(500).json({
                    message: 'Error al obtener conteo de likes',
                    error
                });
            }
        });
    }
    static getCount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { postId } = req.params;
            try {
                const count = yield likeModel_1.Like.countDocuments({ postId });
                return res.json({
                    message: 'Conteo de likes obtenido exitosamente',
                    data: { count }
                });
            }
            catch (error) {
                console.error('Error al obtener conteo de likes:', error);
                return res.status(500).json({
                    message: 'Error al obtener conteo de likes',
                    error
                });
            }
        });
    }
}
exports.LikeController = LikeController;
