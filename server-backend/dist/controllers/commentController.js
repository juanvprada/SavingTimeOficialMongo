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
const models_1 = require("../models");
const sequelize_1 = require("sequelize");
class CommentController {
    static create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { postId } = req.params;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
            const { content } = req.body;
            if (!userId) {
                return res.status(401).json({
                    message: 'Usuario no autenticado'
                });
            }
            try {
                const newComment = yield models_1.Comment.create({
                    userId,
                    postId,
                    content
                });
                const commentWithUser = yield models_1.Comment.findOne({
                    where: { id: newComment.id },
                    include: [{
                            model: models_1.User,
                            as: 'user',
                            attributes: ['name']
                        }]
                });
                if (!commentWithUser) {
                    return res.status(500).json({
                        message: 'Error al obtener el comentario creado'
                    });
                }
                return res.status(201).json({
                    message: 'Comentario creado exitosamente',
                    data: commentWithUser.toJSON()
                });
            }
            catch (error) {
                console.error('Error al crear comentario:', error);
                if (error instanceof sequelize_1.ValidationError) {
                    return res.status(400).json({
                        message: 'Error de validación',
                        error: {
                            details: error.errors.map(e => ({
                                field: e.path,
                                message: e.message
                            }))
                        }
                    });
                }
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
                const comments = yield models_1.Comment.findAll({
                    where: { postId },
                    include: [{
                            model: models_1.User,
                            as: 'user',
                            attributes: ['name']
                        }],
                    order: [['created_at', 'DESC']]
                });
                // Format the comments with proper date handling
                const formattedComments = comments.map(comment => {
                    const plainComment = comment.get({ plain: true });
                    return Object.assign(Object.assign({}, plainComment), { created_at: comment.created_at ? new Date(comment.created_at).toISOString() : null, updated_at: comment.updated_at ? new Date(comment.updated_at).toISOString() : null });
                });
                console.log('Formatted comments:', formattedComments); // Debug log
                return res.status(200).json({
                    message: formattedComments.length ? 'Comentarios obtenidos exitosamente' : 'No hay comentarios',
                    data: formattedComments
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
                const comment = yield models_1.Comment.findOne({
                    where: {
                        id,
                        user_id: userId
                    }
                });
                if (!comment) {
                    return res.status(404).json({
                        message: 'Comentario no encontrado o no autorizado para editarlo'
                    });
                }
                const updatedComment = yield comment.update({ content });
                return res.status(200).json({
                    message: 'Comentario actualizado exitosamente',
                    data: updatedComment.get({ plain: true })
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
                const comment = yield models_1.Comment.findOne({
                    where: {
                        id,
                        user_id: userId
                    }
                });
                if (!comment) {
                    return res.status(404).json({
                        message: 'Comentario no encontrado o no autorizado para eliminarlo'
                    });
                }
                yield comment.destroy();
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
