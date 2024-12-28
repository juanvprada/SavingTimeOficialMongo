import express, { Request, Response } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { loginUser, registerUser } from '../controllers/userController';
import { loginValidation, validationHandler, registerValidation } from '../validations/blogValidation';
import { likePostValidation, createPostValidation } from '../validations/blogValidation';
import { toggleLike } from '../controllers/likeController';
import { createPost } from '../controllers/postController';
import { roleValidation } from '../middleware/authMiddleware';

const router = express.Router();

/* ====================
   Registro de Usuario
   ==================== */
router.post('/registro', registerValidation, validationHandler, registerUser);

/* ====================
   Inicio de Sesión de Usuario
   ==================== */
router.post('/acceso', loginValidation, validationHandler, loginUser);

/* ====================
   Perfil de Usuario (requiere autenticación)
   ==================== */
router.get('/perfil', authMiddleware, (req: Request & { user?: { userId: number; role: string } }, res: Response) => {
    const userId = req.user?.userId;
    const role = req.user?.role;

    res.json({
        message: 'Perfil de usuario',
        userId,
        role,
    });
});

/* ====================
   Dar "Like" a una Publicación (Usuarios pueden hacer esto)
   ==================== */
router.post('/like', likePostValidation, validationHandler, toggleLike);

/* ====================
   Crear un Nuevo Post (Solo Admin puede hacerlo)
   ==================== */
router.post('/posts', authMiddleware, roleValidation(['admin']), createPostValidation, validationHandler, createPost);

/* ====================
   Ruta Protegida para Actualizar Roles de Usuario (Solo Admin puede hacerlo)
   ==================== */
router.put('/actualizar-rol/:id', authMiddleware, roleValidation(['admin']), (req: Request, res: Response) => {
    const { id } = req.params;
    const { role } = req.body;

    // Lógica para actualizar el rol
    res.json({ message: `Rol de usuario con ID ${id} actualizado a ${role}` });
});

export default router;
