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
exports.PostController = void 0;
const models_1 = require("../models");
const uuid_1 = require("uuid");
const constants_1 = require("../config/constants");
const sequelize_1 = require("sequelize");
class PostController {
    // Crear un nuevo post
    static create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, kindOfPost, description, userId } = req.body;
            if (!name || !kindOfPost || !description || !userId) {
                return res.status(400).json({
                    message: 'Los campos nombre, tipo, descripción y usuario son obligatorios'
                });
            }
            try {
                // Handle multiple images
                const images = [];
                if (req.files && Array.isArray(req.files)) {
                    req.files.forEach(file => {
                        images.push(`/${constants_1.CONFIG.UPLOAD.PATH}/${file.filename}`);
                    });
                }
                const newPost = yield models_1.Post.create({
                    id: (0, uuid_1.v4)(),
                    name,
                    kindOfPost,
                    description,
                    images, // Store array of image paths
                    userId
                });
                // Format the response
                const formattedPost = Object.assign(Object.assign({}, newPost.get({ plain: true })), { images: images.map(image => `http://localhost:5000${image}`) });
                return res.status(201).json({
                    message: 'Post creado con éxito',
                    data: formattedPost
                });
            }
            catch (error) {
                console.error('Error detallado al crear post:', error);
                if (error instanceof sequelize_1.ValidationError) {
                    return res.status(400).json({
                        message: 'Error de validación',
                    });
                }
                return res.status(500).json({
                    message: 'Error al crear el post',
                    error: error instanceof Error ? error.message : 'Error desconocido'
                });
            }
        });
    }
    // Obtener un post por ID
    static getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const post = yield models_1.Post.findByPk(id, {
                    include: [{
                            model: models_1.User,
                            as: 'user',
                            attributes: ['id', 'name']
                        }]
                });
                if (!post) {
                    return res.status(404).json({
                        message: 'Post no encontrado'
                    });
                }
                // Get the plain object and format dates and images
                const formattedPost = Object.assign(Object.assign({}, post.get({ plain: true })), { created_at: post.created_at
                        ? new Date(post.created_at).toISOString()
                        : null, updated_at: post.updated_at
                        ? new Date(post.updated_at).toISOString()
                        : null, images: post.images && Array.isArray(post.images) && post.images.length > 0
                        ? post.images.map(image => `http://localhost:5000${image}`)
                        : ['http://localhost:5000/uploads/default.jpg'] });
                return res.json({
                    message: 'Post encontrado',
                    data: formattedPost
                });
            }
            catch (error) {
                console.error('Error al obtener post:', error);
                return res.status(500).json({
                    message: 'Error al obtener el post',
                    error: error instanceof Error ? error.message : 'Error desconocido'
                });
            }
        });
    }
    // Actualizar un post
    static update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { name, kindOfPost, description } = req.body;
            try {
                const post = yield models_1.Post.findByPk(id);
                if (!post) {
                    return res.status(404).json({
                        message: 'Post no encontrado'
                    });
                }
                // Handle new images while keeping existing ones
                let updatedImages = post.images || [];
                if (req.files && Array.isArray(req.files)) {
                    const newImages = req.files.map(file => `/${constants_1.CONFIG.UPLOAD.PATH}/${file.filename}`);
                    updatedImages = [...updatedImages, ...newImages];
                }
                const updatedPost = yield post.update({
                    name,
                    kindOfPost,
                    description,
                    images: updatedImages
                });
                // Format the response
                const formattedPost = Object.assign(Object.assign({}, updatedPost.get({ plain: true })), { images: updatedImages.map(image => `http://localhost:5000${image}`) });
                return res.json({
                    message: 'Post actualizado con éxito',
                    data: formattedPost
                });
            }
            catch (error) {
                console.error('Error al actualizar post:', error);
                return res.status(500).json({
                    message: 'Error al actualizar el post',
                    error: error instanceof Error ? error.message : 'Error desconocido'
                });
            }
        });
    }
    // Eliminar un post
    static delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const post = yield models_1.Post.findByPk(id);
                if (!post) {
                    return res.status(404).json({
                        message: 'Post no encontrado'
                    });
                }
                // Optional: Delete image files from the server
                if (post.images && Array.isArray(post.images)) {
                    // You might want to add file deletion logic here
                    // Remember to handle errors appropriately
                }
                yield post.destroy();
                return res.json({
                    message: 'Post eliminado con éxito'
                });
            }
            catch (error) {
                console.error('Error al eliminar post:', error);
                return res.status(500).json({
                    message: 'Error al eliminar el post',
                    error: error instanceof Error ? error.message : 'Error desconocido'
                });
            }
        });
    }
    // Obtener todos los posts
    static getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const posts = yield models_1.Post.findAll({
                    include: [{
                            model: models_1.User,
                            as: 'user',
                            attributes: ['name']
                        }],
                    order: [['created_at', 'DESC']]
                });
                const formattedPosts = posts.map((post) => (Object.assign(Object.assign({}, post.get({ plain: true })), { created_at: post.created_at
                        ? new Date(post.created_at).toISOString()
                        : null, updated_at: post.updated_at
                        ? new Date(post.updated_at).toISOString()
                        : null, images: post.images && Array.isArray(post.images) && post.images.length > 0
                        ? post.images.map(image => `http://localhost:5000${image}`)
                        : ['http://localhost:5000/uploads/default.jpg'] })));
                return res.json({
                    message: 'Posts obtenidos con éxito',
                    data: formattedPosts
                });
            }
            catch (error) {
                console.error('Error al obtener posts:', error);
                return res.status(500).json({
                    message: 'Error al obtener posts',
                    error: error instanceof Error ? error.message : 'Error desconocido'
                });
            }
        });
    }
    // Opcional: Método para eliminar una imagen específica de un post
    static removeImage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { imageIndex } = req.body;
            try {
                const post = yield models_1.Post.findByPk(id);
                if (!post) {
                    return res.status(404).json({
                        message: 'Post no encontrado'
                    });
                }
                if (!Array.isArray(post.images) || imageIndex >= post.images.length) {
                    return res.status(400).json({
                        message: 'Índice de imagen inválido'
                    });
                }
                const updatedImages = post.images.filter((_, index) => index !== imageIndex);
                const updatedPost = yield post.update({
                    images: updatedImages
                });
                // Format the response
                const formattedPost = Object.assign(Object.assign({}, updatedPost.get({ plain: true })), { images: updatedImages.map(image => `http://localhost:5000${image}`) });
                return res.json({
                    message: 'Imagen eliminada con éxito',
                    data: formattedPost
                });
            }
            catch (error) {
                console.error('Error al eliminar imagen:', error);
                return res.status(500).json({
                    message: 'Error al eliminar la imagen',
                    error: error instanceof Error ? error.message : 'Error desconocido'
                });
            }
        });
    }
}
exports.PostController = PostController;
