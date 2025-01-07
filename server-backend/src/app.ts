// app.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { sequelize } from './database/sequelize';
import { initializeAssociations } from './models';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import postRoutes from './routes/postRoutes';
import roleRoutes from './routes/roleRoutes';
import likeRoutes from './routes/likeRoutes';
import commentRoutes from './routes/commentRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Configuración de CORS
const allowedOrigins = [
  'https://savingtimeoficial-production.up.railway.app',
  'http://localhost:3000',
  'http://localhost:5000',
  'http://localhost:8080'
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('Origin not allowed:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json());

// Archivos estáticos
const uploadPath = path.join(__dirname, '../uploads');
console.log('Upload path:', uploadPath);
app.use('/uploads', express.static(uploadPath));

// Inicializar asociaciones
initializeAssociations();

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/comments', commentRoutes);

// Servir el frontend
const publicPath = path.join(__dirname, '../public');
app.use(express.static(publicPath));

// Ruta catch-all para SPA
app.get('*', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

// Iniciar servidor con verificación de base de datos
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Base de datos conectada.');
    
    await sequelize.sync({ alter: true });
    console.log('✅ Modelos sincronizados.');

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();

export default app;