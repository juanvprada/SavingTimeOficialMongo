"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authRoutes_1 = __importDefault(require("./authRoutes"));
const userRoutes_1 = __importDefault(require("./userRoutes"));
const postRoutes_1 = __importDefault(require("./postRoutes"));
const likeRoutes_1 = __importDefault(require("./likeRoutes"));
const commentRoutes_1 = __importDefault(require("./commentRoutes"));
const roleRoutes_1 = __importDefault(require("./roleRoutes"));
const router = (0, express_1.Router)();
// Rutas principales
router.use('/auth', authRoutes_1.default);
router.use('/users', userRoutes_1.default);
router.use('/posts', postRoutes_1.default);
router.use('/likes', likeRoutes_1.default);
router.use('/comments', commentRoutes_1.default);
router.use('/roles', roleRoutes_1.default);
exports.default = router;
