"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleValidation = void 0;
const express_validator_1 = require("express-validator");
const interfaces_1 = require("../interfaces");
exports.RoleValidation = {
    update: [
        (0, express_validator_1.body)('role')
            .isIn(Object.values(interfaces_1.UserRole))
            .withMessage('Rol no válido')
    ]
};
