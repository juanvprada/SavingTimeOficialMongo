// src/routes/statistics.ts
import { Request, Response, Router } from 'express';
import { Post } from '../models/postModel'; 
import { User } from '../models/userModel';

const router = Router();

// Interfaz para las estadísticas
interface Statistics {
    placesCount: number;
    usersCount: number;
    countriesCount: number;
}

/**
 * @route   GET /api/statistics
 * @desc    Obtener estadísticas generales de la aplicación
 * @access  Public
 */
router.get('/', async (req: Request, res: Response) => {
    try {
        // Contar lugares (posts) compartidos
        const placesCount = await Post.countDocuments();

        // Contar usuarios activos - Ajustado porque tu modelo no tiene 'active'
        const usersCount = await User.countDocuments();

        // Contar ciudades únicas ya que tu modelo tiene 'city' y no 'country'
        const uniqueCities = await Post.distinct('city');
        const countriesCount = uniqueCities.length;

        const statistics: Statistics = {
            placesCount,
            usersCount,
            countriesCount
        };

        return res.status(200).json(statistics);
    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        return res.status(500).json({ message: 'Error al obtener estadísticas', error });
    }
});

export default router;