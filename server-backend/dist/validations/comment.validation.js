"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentValidation = void 0;
const express_validator_1 = require("express-validator");
exports.CommentValidation = {
    create: [
        (0, express_validator_1.body)('content').notEmpty().withMessage('El contenido es requerido')
    ],
    update: [
        (0, express_validator_1.body)('content').notEmpty().withMessage('El contenido es requerido')
    ]
};
