"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const likeController_1 = require("../controllers/likeController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.post('/:postId/toggle', authMiddleware_1.AuthMiddleware.authenticate, likeController_1.LikeController.toggle);
router.get('/:postId/count', likeController_1.LikeController.getCount);
exports.default = router;
