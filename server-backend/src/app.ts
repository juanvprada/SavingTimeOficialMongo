import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { initializeAssociations } from './models';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import postRoutes from './routes/postRoutes';
import roleRoutes from './routes/roleRoutes';
import likeRoutes from './routes/likeRoutes';
import commentRoutes from './routes/commentRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configuración de orígenes permitidos
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const ALLOWED_ORIGINS = [
  FRONTEND_URL,
  'https://tu-app.railway.app', // Reemplaza con tu URL de Railway
  'http://localhost:5000',
  'http://localhost:3000'
];

// Inicializar asociaciones
initializeAssociations();

// Configuración de CORS
app.use(cors({
  origin: function(origin, callback) {
    // Permitir peticiones sin origen (como las peticiones móviles o Postman)
    if (!origin) return callback(null, true);
    
    if (ALLOWED_ORIGINS.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware para procesar JSON
app.use(express.json());

// Configuración de archivos estáticos
const uploadPath = path.join(__dirname, '../uploads');
console.log('Upload path:', uploadPath);
app.use('/uploads', express.static(uploadPath));

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/comments', commentRoutes);

// Servir el frontend estático desde la carpeta public
const publicPath = path.join(__dirname, '../public');
app.use(express.static(publicPath));

// Manejar rutas desconocidas y devolver el index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

export default app;