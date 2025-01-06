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
const PORT = process.env.PORT || 8080; // Nota: Railway usa 8080 por defecto

// Configuración de CORS más específica
const allowedOrigins = [
  'https://savingtimeoficial-production.up.railway.app',
  'http://localhost:3000',
  'http://localhost:5000',
  'http://localhost:8080'
];

app.use(cors({
  origin: function(origin, callback) {
    // Permitir peticiones sin origen (como postman o aplicaciones móviles)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('Origin not allowed:', origin); // Para debugging
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Inicializar asociaciones
initializeAssociations();

// Middleware para procesar JSON
app.use(express.json());

// Archivos estáticos
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

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

export default app;