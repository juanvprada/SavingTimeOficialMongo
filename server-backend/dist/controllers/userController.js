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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const models_1 = require("../models");
const auth_service_1 = require("../services/auth.service");
const constants_1 = require("../config/constants");
class UserController {
    static register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, email, password, role = 'user' } = req.body;
            try {
                const existingUser = yield models_1.User.findOne({ where: { email } });
                if (existingUser) {
                    return res.status(400).json({
                        message: 'El usuario ya existe'
                    });
                }
                const hashedPassword = yield auth_service_1.AuthService.hashPassword(password);
                const newUser = yield models_1.User.create({
                    name,
                    email,
                    password: hashedPassword,
                    role,
                });
                const token = auth_service_1.AuthService.generateToken(newUser);
                return res.status(201).json({
                    message: 'Usuario registrado con éxito',
                    data: {
                        userId: newUser.id,
                        role: newUser.role,
                        name: newUser.name,
                        token
                    }
                });
            }
            catch (error) {
                console.error('Error al registrar usuario:', error);
                return res.status(500).json({
                    message: 'Error al registrar el usuario',
                    error
                });
            }
        });
    }
    static login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            try {
                const user = yield models_1.User.findOne({
                    where: { email },
                    attributes: ['id', 'name', 'email', 'password', 'role']
                });
                if (!user || !(yield auth_service_1.AuthService.comparePasswords(password, user.password))) {
                    return res.status(401).json({
                        message: 'Credenciales inválidas'
                    });
                }
                const token = auth_service_1.AuthService.generateToken(user);
                // Añade console.log para debug
                console.log('Enviando respuesta:', {
                    userId: user.id,
                    role: user.role,
                    name: user.name,
                    token
                });
                return res.json({
                    message: 'Inicio de sesión exitoso',
                    data: {
                        userId: user.id,
                        role: user.role,
                        name: user.name,
                        token
                    }
                });
            }
            catch (error) {
                console.error('Error en login:', error);
                return res.status(500).json({
                    message: 'Error al iniciar sesión',
                    error
                });
            }
        });
    }
    static getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield models_1.User.findAll({
                    attributes: ['id', 'email', 'role']
                });
                return res.json({
                    message: 'Usuarios obtenidos con éxito',
                    data: users
                });
            }
            catch (error) {
                console.error('Error al obtener usuarios:', error);
                return res.status(500).json({
                    message: 'Error al obtener usuarios',
                    error
                });
            }
        });
    }
    static getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const user = yield models_1.User.findByPk(id, {
                    attributes: ['id', 'name', 'email', 'role']
                });
                if (!user) {
                    return res.status(404).json({
                        message: 'Usuario no encontrado'
                    });
                }
                return res.json({
                    message: 'Usuario encontrado',
                    data: user
                });
            }
            catch (error) {
                console.error('Error al obtener usuario:', error);
                return res.status(500).json({
                    message: 'Error al obtener usuario',
                    error
                });
            }
        });
    }
    static update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const updateData = req.body;
            try {
                const user = yield models_1.User.findByPk(id);
                if (!user) {
                    return res.status(404).json({
                        message: 'Usuario no encontrado'
                    });
                }
                const updatedUser = yield user.update(updateData);
                return res.json({
                    message: 'Usuario actualizado exitosamente',
                    data: updatedUser
                });
            }
            catch (error) {
                console.error('Error al actualizar usuario:', error);
                return res.status(500).json({
                    message: 'Error al actualizar usuario',
                    error
                });
            }
        });
    }
    static recoverPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            try {
                const user = yield models_1.User.findOne({ where: { email } });
                if (!user) {
                    return res.status(404).json({
                        message: 'Usuario no encontrado'
                    });
                }
                const token = jsonwebtoken_1.default.sign({ userId: user.id }, constants_1.CONFIG.JWT.SECRET, { expiresIn: '2h' });
                return res.status(200).json({
                    message: 'Token de recuperación generado exitosamente',
                    data: { token }
                });
            }
            catch (error) {
                console.error('Error al generar token de recuperación:', error);
                return res.status(500).json({
                    message: 'Error al generar token de recuperación',
                    error
                });
            }
        });
    }
    static resetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { token, password } = req.body;
            try {
                const decoded = jsonwebtoken_1.default.verify(token, constants_1.CONFIG.JWT.SECRET);
                const user = yield models_1.User.findByPk(decoded.userId);
                if (!user) {
                    return res.status(404).json({
                        message: 'Usuario no encontrado'
                    });
                }
                const hashedPassword = yield auth_service_1.AuthService.hashPassword(password);
                yield user.update({ password: hashedPassword });
                return res.status(200).json({
                    message: 'Contraseña restablecida exitosamente'
                });
            }
            catch (error) {
                console.error('Error al restablecer contraseña:', error);
                return res.status(400).json({
                    message: 'Token inválido o expirado',
                    error
                });
            }
        });
    }
    static getProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
            try {
                const user = yield models_1.User.findByPk(userId, {
                    attributes: ['id', 'name', 'email', 'role']
                });
                if (!user) {
                    return res.status(404).json({
                        message: 'Usuario no encontrado'
                    });
                }
                return res.json({
                    message: 'Perfil obtenido exitosamente',
                    data: user
                });
            }
            catch (error) {
                console.error('Error al obtener perfil:', error);
                return res.status(500).json({
                    message: 'Error al obtener perfil',
                    error
                });
            }
        });
    }
}
exports.UserController = UserController;
