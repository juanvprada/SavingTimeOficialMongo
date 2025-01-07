"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const constants_1 = require("../config/constants");
class AuthMiddleware {
    static authenticate(req, res, next) {
        var _a;
        console.log('Headers:', req.headers);
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        console.log('Token:', token);
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }
        try {
            const verified = jsonwebtoken_1.default.verify(token, constants_1.CONFIG.JWT.SECRET);
            console.log('Verified token:', verified);
            req.user = verified;
            next();
        }
        catch (error) {
            console.error('Auth error:', error);
            return res.status(401).json({ message: 'Invalid token' });
        }
    }
    static authorize(roles) {
        return (req, res, next) => {
            if (!req.user) {
                return res.status(401).json({
                    message: 'Usuario no autenticado.'
                });
            }
            if (!roles.includes(req.user.role)) {
                return res.status(403).json({
                    message: 'Acceso denegado. Rol insuficiente.'
                });
            }
            next();
        };
    }
}
exports.AuthMiddleware = AuthMiddleware;
