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
exports.CommentController = void 0;
const commentModel_1 = require("../models/commentModel");
class CommentController {
    static create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { postId, content } = req.body;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
            try {
                const newComment = yield commentModel_1.Comment.create({ postId, content, userId });
                const populatedComment = yield newComment.populate('userId', 'name');
                return res.status(201).json({
                    message: 'Comentario creado exitosamente',
                    data: populatedComment
                });
            }
            catch (error) {
                console.error('Error al crear comentario:', error);
                return res.status(500).json({
                    message: 'Error al crear comentario'
                });
            }
        });
    }
    static getByPostId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { postId } = req.params;
            try {
                const comments = yield commentModel_1.Comment.find({ postId })
                    .populate('userId', 'name') // Relación con el usuario
                    .sort({ createdAt: -1 }); // Ordenar por fecha de creación
                return res.status(200).json({
                    message: comments.length ? 'Comentarios obtenidos exitosamente' : 'No hay comentarios',
                    data: comments
                });
            }
            catch (error) {
                console.error('Error al obtener comentarios:', error);
                return res.status(500).json({
                    message: 'Error al obtener comentarios',
                    data: []
                });
            }
        });
    }
    static update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { id } = req.params;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
            const { content } = req.body;
            if (!userId) {
                return res.status(401).json({
                    message: 'Usuario no autenticado'
                });
            }
            try {
                const comment = yield commentModel_1.Comment.findOne({ _id: id, userId });
                if (!comment) {
                    return res.status(404).json({
                        message: 'Comentario no encontrado o no autorizado para editarlo'
                    });
                }
                comment.content = content;
                yield comment.save();
                return res.status(200).json({
                    message: 'Comentario actualizado exitosamente',
                    data: comment
                });
            }
            catch (error) {
                console.error('Error al actualizar comentario:', error);
                return res.status(500).json({
                    message: 'Error al actualizar comentario'
                });
            }
        });
    }
    static delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { id } = req.params;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
            if (!userId) {
                return res.status(401).json({
                    message: 'Usuario no autenticado'
                });
            }
            try {
                const comment = yield commentModel_1.Comment.findOne({ _id: id, userId });
                if (!comment) {
                    return res.status(404).json({
                        message: 'Comentario no encontrado o no autorizado para eliminarlo'
                    });
                }
                yield comment.deleteOne();
                return res.status(200).json({
                    message: 'Comentario eliminado exitosamente'
                });
            }
            catch (error) {
                console.error('Error al eliminar comentario:', error);
                return res.status(500).json({
                    message: 'Error al eliminar comentario'
                });
            }
        });
    }
}
exports.CommentController = CommentController;
