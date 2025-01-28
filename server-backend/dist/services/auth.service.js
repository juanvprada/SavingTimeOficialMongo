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
exports.AuthService = void 0;
// src/services/auth.service.ts
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const constants_1 = require("../config/constants");
class AuthService {
    static hashPassword(password) {
        return __awaiter(this, void 0, void 0, function* () {
            return bcryptjs_1.default.hash(password, this.SALT_ROUNDS);
        });
    }
    static comparePasswords(plainPassword, hashedPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('Comparing passwords:', { plainPassword, hashedPassword });
                return yield bcryptjs_1.default.compare(plainPassword, hashedPassword);
            }
            catch (error) {
                console.error('Error comparing passwords:', error);
                return false;
            }
        });
    }
    static generateToken(payload) {
        return jsonwebtoken_1.default.sign(payload, constants_1.CONFIG.JWT.SECRET, { expiresIn: constants_1.CONFIG.JWT.EXPIRES_IN });
    }
}
exports.AuthService = AuthService;
AuthService.SALT_ROUNDS = 10;
