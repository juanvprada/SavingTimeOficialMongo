import { Router } from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import postRoutes from './postRoutes';
import likeRoutes from './likeRoutes';
import commentRoutes from './commentRoutes';
import roleRoutes from './roleRoutes';

const router = Router();

// Rutas principales
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/likes', likeRoutes);
router.use('/comments', commentRoutes);
router.use('/roles', roleRoutes);

export default router;