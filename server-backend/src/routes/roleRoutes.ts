import express from 'express';
import { updateUserRole } from '../controllers/roleController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Ruta para actualizar el rol de un usuario
router.patch('/:id/role', authMiddleware, updateUserRole);


export default router;
