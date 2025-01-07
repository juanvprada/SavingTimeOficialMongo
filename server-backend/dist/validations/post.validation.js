"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostValidation = void 0;
const express_validator_1 = require("express-validator");
exports.PostValidation = {
    create: [
        (0, express_validator_1.body)('name').notEmpty().withMessage('El nombre es requerido'),
        (0, express_validator_1.body)('kindOfPost').notEmpty().withMessage('El tipo de post es requerido'),
        (0, express_validator_1.body)('description').notEmpty().withMessage('La descripción es requerida'),
        (0, express_validator_1.body)('userId').notEmpty().withMessage('El userId es requerido')
    ],
    update: [
        (0, express_validator_1.body)('name').optional().notEmpty().withMessage('El nombre no puede estar vacío'),
        (0, express_validator_1.body)('kindOfPost').optional().notEmpty().withMessage('El tipo de post no puede estar vacío'),
        (0, express_validator_1.body)('description').optional().notEmpty().withMessage('La descripción no puede estar vacía')
    ]
};
