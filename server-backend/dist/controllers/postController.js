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
const mongoose_1 = require("mongoose");
const postModel_1 = require("../models/postModel");
class PostController {
    static getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const posts = yield postModel_1.Post.find()
                    .populate('userId', 'name')
                    .lean();
                const formattedPosts = posts.map(post => (Object.assign(Object.assign({}, post), { id: post._id.toString(), userId: new mongoose_1.Types.ObjectId(typeof post.userId === 'object'
                        ? post.userId._id
                        : post.userId) })));
                return res.json({
                    message: 'Posts obtenidos con éxito',
                    data: formattedPosts
                });
            }
            catch (error) {
                console.error('Error al obtener posts:', error);
                return res.status(500).json({
                    message: 'Error al obtener los posts',
                    data: [],
                    error: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
    }
    // Crear un nuevo post
    static create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, kindOfPost, description, userId, city, price, rating } = req.body;
                // Log para debugging
                console.log('Received data:', {
                    name, kindOfPost, description, userId, city, price,
                    files: req.files
                });
                // Validar tipos de datos
                const postData = {
                    name: String(name),
                    kindOfPost: String(kindOfPost),
                    description: String(description),
                    city: String(city),
                    price: Number(price),
                    userId: new mongoose_1.Types.ObjectId(userId),
                    images: [],
                    rating: Number(rating),
                };
                // Procesar imágenes
                if (req.files && Array.isArray(req.files)) {
                    postData.images = req.files.map(file => file.filename);
                }
                // Crear el post
                const newPost = yield postModel_1.Post.create(postData);
                // Poblar el usuario
                const populatedPost = yield postModel_1.Post.findById(newPost._id)
                    .populate('userId', 'name email')
                    .lean();
                if (!populatedPost) {
                    throw new Error('Error al crear el post');
                }
                return res.status(201).json({
                    message: 'Post creado con éxito',
                    data: Object.assign(Object.assign({}, populatedPost), { id: populatedPost._id.toString() })
                });
            }
            catch (error) {
                console.error('Error detallado en el servidor:', error);
                return res.status(500).json({
                    message: 'Error al crear el post',
                    error: error instanceof Error ? error.message : 'Error desconocido'
                });
            }
        });
    }
    static getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const post = yield postModel_1.Post.findById(id).populate('userId', 'name');
                if (!post) {
                    return res.status(404).json({
                        message: 'Post no encontrado'
                    });
                }
                return res.json({
                    message: 'Post encontrado',
                    data: post
                });
            }
            catch (error) {
                console.error('Error al obtener post:', error);
                return res.status(500).json({
                    message: 'Error al obtener el post',
                    error
                });
            }
        });
    }
    static update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const updateData = Object.assign({}, req.body);
                const files = req.files;
                const currentPost = yield postModel_1.Post.findById(id);
                if (!currentPost) {
                    return res.status(404).json({ message: 'Post no encontrado' });
                }
                let images = currentPost.images || [];
                // Procesar existingImages primero
                if (updateData.existingImages) {
                    images = Array.isArray(updateData.existingImages)
                        ? updateData.existingImages
                        : [updateData.existingImages];
                }
                // Añadir nuevas imágenes
                if (files === null || files === void 0 ? void 0 : files.length) {
                    const newImages = files.map(file => file.filename);
                    if (images.length > 0) {
                        images = [...images, ...newImages];
                    }
                    else {
                        images = newImages;
                    }
                }
                updateData.images = images;
                delete updateData.existingImages;
                const updatedPost = yield postModel_1.Post.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).populate('userId', 'name');
                if (!updatedPost) {
                    return res.status(404).json({ message: 'Error al actualizar el post' });
                }
                return res.json({
                    message: 'Post actualizado con éxito',
                    data: updatedPost.toObject()
                });
            }
            catch (error) {
                console.error('Error al actualizar post:', error);
                return res.status(500).json({
                    message: 'Error al actualizar el post',
                    error
                });
            }
        });
    }
    static delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const post = yield postModel_1.Post.findByIdAndDelete(id);
                if (!post) {
                    return res.status(404).json({
                        message: 'Post no encontrado'
                    });
                }
                return res.json({
                    message: 'Post eliminado con éxito'
                });
            }
            catch (error) {
                console.error('Error al eliminar post:', error);
                return res.status(500).json({
                    message: 'Error al eliminar el post',
                    error
                });
            }
        });
    }
}
exports.PostController = PostController;
