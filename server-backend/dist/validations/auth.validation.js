"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidation = void 0;
// auth.validation.ts
const express_validator_1 = require("express-validator");
exports.AuthValidation = {
    register: [
        (0, express_validator_1.body)('name')
            .trim()
            .notEmpty().withMessage('El nombre es requerido')
            .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres')
            .matches(/^[a-zA-ZÀ-ÿ\s]{2,}$/).withMessage('El nombre solo debe contener letras'),
        (0, express_validator_1.body)('email')
            .trim()
            .notEmpty().withMessage('El email es requerido')
            .isEmail().withMessage('Email inválido')
            .normalizeEmail(),
        (0, express_validator_1.body)('password')
            .trim()
            .notEmpty().withMessage('La contraseña es requerida')
            .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
            .matches(/\d/).withMessage('La contraseña debe contener al menos un número')
    ],
    login: [
        (0, express_validator_1.body)('email')
            .trim()
            .notEmpty().withMessage('El email es requerido')
            .isEmail().withMessage('Email inválido')
            .normalizeEmail(),
        (0, express_validator_1.body)('password')
            .trim()
            .notEmpty().withMessage('La contraseña es requerida')
    ],
    recoverPassword: [
        (0, express_validator_1.body)('email')
            .trim()
            .notEmpty().withMessage('El email es requerido')
            .isEmail().withMessage('Email inválido')
            .normalizeEmail()
    ],
    resetPassword: [
        (0, express_validator_1.body)('token')
            .trim()
            .notEmpty().withMessage('Token es requerido'),
        (0, express_validator_1.body)('password')
            .trim()
            .notEmpty().withMessage('La contraseña es requerida')
            .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
            .matches(/\d/).withMessage('La contraseña debe contener al menos un número')
    ]
};
