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
exports.ValidationMiddleware = void 0;
const express_validator_1 = require("express-validator");
class ValidationMiddleware {
    static validate(validations) {
        return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                // Execute all validations
                yield Promise.all(validations.map(validation => validation.run(req)));
                const errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    // Format errors in a more user-friendly way
                    const formattedErrors = errors.array().map(err => ({
                        message: err.msg
                    }));
                    // Return the first error message as the main message
                    return res.status(400).json({
                        message: formattedErrors[0].message,
                        errors: formattedErrors
                    });
                }
                return next();
            }
            catch (error) {
                console.error('Validation error:', error);
                return res.status(500).json({
                    message: 'Error en la validación de datos',
                    error: error instanceof Error ? error.message : 'Error desconocido'
                });
            }
        });
    }
}
exports.ValidationMiddleware = ValidationMiddleware;
