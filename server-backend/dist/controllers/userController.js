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
const userModel_1 = require("../models/userModel");
const auth_service_1 = require("../services/auth.service");
const constants_1 = require("../config/constants");
class UserController {
    static register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, email, password } = req.body;
            try {
                // Check if email already exists
                const existingUser = yield userModel_1.User.findOne({ email: email.toLowerCase() });
                if (existingUser) {
                    return res.status(400).json({
                        message: 'Este email ya está registrado'
                    });
                }
                // Create new user
                const hashedPassword = yield auth_service_1.AuthService.hashPassword(password);
                const newUser = yield userModel_1.User.create({
                    name: name.trim(),
                    email: email.toLowerCase().trim(),
                    password: hashedPassword,
                    role: 'user' // Default role
                });
                // Generate token
                const token = auth_service_1.AuthService.generateToken({
                    userId: newUser._id.toString(),
                    role: newUser.role,
                    email: newUser.email,
                    name: newUser.name,
                });
                return res.status(201).json({
                    message: 'Usuario registrado con éxito',
                    data: {
                        userId: newUser._id.toString(),
                        role: newUser.role,
                        name: newUser.name,
                        token,
                    },
                });
            }
            catch (error) {
                console.error('Error al registrar usuario:', error);
                return res.status(500).json({
                    message: 'Error al registrar el usuario, por favor intente nuevamente',
                    error: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
    }
    static login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            try {
                const user = yield userModel_1.User.findOne({ email }).select('+password');
                if (!user || !(yield auth_service_1.AuthService.comparePasswords(password, user.password))) {
                    return res.status(401).json({
                        message: 'Credenciales inválidas',
                    });
                }
                const token = auth_service_1.AuthService.generateToken({
                    userId: user._id.toString(), // Convertir ObjectId a string
                    role: user.role,
                    email: user.email,
                    name: user.name,
                });
                return res.json({
                    message: 'Inicio de sesión exitoso',
                    data: {
                        userId: user._id.toString(), // Convertir ObjectId a string
                        role: user.role,
                        name: user.name,
                        token,
                    },
                });
            }
            catch (error) {
                console.error('Error en login:', error);
                return res.status(500).json({
                    message: 'Error al iniciar sesión',
                    error,
                });
            }
        });
    }
    static getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield userModel_1.User.find({}, 'email role');
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
                const user = yield userModel_1.User.findById(id).select('-password');
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
                const updatedUser = yield userModel_1.User.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true }).select('-password');
                if (!updatedUser) {
                    return res.status(404).json({
                        message: 'Usuario no encontrado'
                    });
                }
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
                const user = yield userModel_1.User.findOne({ email });
                if (!user) {
                    return res.status(404).json({
                        message: 'Usuario no encontrado',
                    });
                }
                const token = jsonwebtoken_1.default.sign({ userId: user._id.toString() }, // Convertir ObjectId a string
                constants_1.CONFIG.JWT.SECRET, { expiresIn: '2h' });
                return res.status(200).json({
                    message: 'Token de recuperación generado exitosamente',
                    data: { token },
                });
            }
            catch (error) {
                console.error('Error al generar token de recuperación:', error);
                return res.status(500).json({
                    message: 'Error al generar token de recuperación',
                    error,
                });
            }
        });
    }
    static resetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { token, password } = req.body;
            try {
                const decoded = jsonwebtoken_1.default.verify(token, constants_1.CONFIG.JWT.SECRET);
                const user = yield userModel_1.User.findById(decoded.userId);
                if (!user) {
                    return res.status(404).json({
                        message: 'Usuario no encontrado',
                    });
                }
                const hashedPassword = yield auth_service_1.AuthService.hashPassword(password);
                yield userModel_1.User.findByIdAndUpdate(user._id, { password: hashedPassword });
                return res.status(200).json({
                    message: 'Contraseña restablecida exitosamente',
                });
            }
            catch (error) {
                console.error('Error al restablecer contraseña:', error);
                return res.status(400).json({
                    message: 'Token inválido o expirado',
                    error,
                });
            }
        });
    }
    static getProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
            try {
                const user = yield userModel_1.User.findById(userId).select('-password');
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
