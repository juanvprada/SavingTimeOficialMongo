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
exports.likePostValidation = exports.createPostValidation = exports.loginValidation = exports.registerValidation = exports.roleValidation = exports.validationHandler = void 0;
const express_validator_1 = require("express-validator");
/* ====================
   Middleware para manejo de errores de validación generados en las solicitudes
   ==================== */
const validationHandler = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};
exports.validationHandler = validationHandler;
/* ====================
   Validación de Roles
   ==================== */
const roleValidation = (requiredRoles) => {
    return (req, res, next) => {
        var _a;
        const userRole = (_a = req.user) === null || _a === void 0 ? void 0 : _a.role;
        // Si el usuario no está en los roles permitidos
        if (!userRole || !requiredRoles.includes(userRole)) {
            return res.status(403).json({ message: 'Acceso denegado. No tienes el rol adecuado.' });
        }
        // Si es adecuado, continuamos con solicitud
        next();
    };
};
exports.roleValidation = roleValidation;
/* ====================
   Registro de Usuarios
   ==================== */
exports.registerValidation = [
    (0, express_validator_1.body)('name')
        .notEmpty().withMessage('El nombre es obligatorio')
        .isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres'),
    (0, express_validator_1.body)('email')
        .isEmail().withMessage('Debe ser un correo electrónico válido')
        .normalizeEmail()
        .custom((value) => __awaiter(void 0, void 0, void 0, function* () {
        const userExists = false; // << Consulta si el correo ya existe en la base de datos
        if (userExists) {
            throw new Error('Este correo electrónico ya está registrado');
        }
        return true;
    })),
    (0, express_validator_1.body)('password')
        .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres')
        .matches(/\d/).withMessage('La contraseña debe contener al menos un número')
        .matches(/[a-zA-Z]/).withMessage('La contraseña debe contener al menos una letra')
        .not().matches(/\s/).withMessage('La contraseña no puede contener espacios'), // Asegura que no haya espacios
];
/* ====================
   Inicio de Sesión
   ==================== */
exports.loginValidation = [
    (0, express_validator_1.body)('email')
        .isEmail().withMessage('Debe ser un correo electrónico válido')
        .normalizeEmail(),
    (0, express_validator_1.body)('password')
        .exists().withMessage('La contraseña es obligatoria')
        .not().matches(/\s/).withMessage('La contraseña no puede contener espacios'), // Asegura que no haya espacios
];
/* ====================
   Creación de Publicaciones
   ==================== */
exports.createPostValidation = [
    (0, express_validator_1.body)('name')
        .notEmpty().withMessage('El título es obligatorio')
        .isLength({ max: 100 }).withMessage('El título no debe exceder los 100 caracteres'),
    (0, express_validator_1.body)('description')
        .notEmpty().withMessage('El contenido es obligatorio')
        .isLength({ min: 100 }).withMessage('El contenido debe tener al menos 100 caracteres'),
    (0, express_validator_1.body)('image')
        .optional()
        .isURL().withMessage('Debe ser una URL válida de una imagen')
        .isLength({ max: 200 }).withMessage('La URL de la imagen no debe exceder los 200 caracteres'),
];
/* ====================
   Dar "Like" a una Publicación
   ==================== */
exports.likePostValidation = [
    (0, express_validator_1.body)('postId')
        .isMongoId().withMessage('ID de publicación inválido')
        .notEmpty().withMessage('El ID de la publicación es obligatorio')
        .custom((value) => __awaiter(void 0, void 0, void 0, function* () {
        const postExists = false; // << Verifica si el postId existe en la base de datos
        if (!postExists) {
            throw new Error('No existe ninguna publicación con este ID');
        }
        return true;
    })),
];
