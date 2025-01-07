"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidation = void 0;
const express_validator_1 = require("express-validator");
exports.AuthValidation = {
    register: [
        (0, express_validator_1.body)('name').notEmpty().withMessage('El nombre es requerido'),
        (0, express_validator_1.body)('email').isEmail().withMessage('Email inválido'),
        (0, express_validator_1.body)('password')
            .isLength({ min: 6 })
            .withMessage('La contraseña debe tener al menos 6 caracteres')
    ],
    login: [
        (0, express_validator_1.body)('email').isEmail().withMessage('Email inválido'),
        (0, express_validator_1.body)('password').notEmpty().withMessage('La contraseña es requerida')
    ],
    recoverPassword: [
        (0, express_validator_1.body)('email').isEmail().withMessage('Email inválido')
    ],
    resetPassword: [
        (0, express_validator_1.body)('token').notEmpty().withMessage('Token es requerido'),
        (0, express_validator_1.body)('password')
            .isLength({ min: 6 })
            .withMessage('La contraseña debe tener al menos 6 caracteres')
    ]
};
