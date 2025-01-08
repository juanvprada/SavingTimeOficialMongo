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

// Endpoint de health check
app.get('/health', (req, res) => {
  try {
    res.status(200).json({
      status: 'OK',
      uptime: process.uptime(),
      timestamp: Date.now()
    });
  } catch (error) {
    res.status(503).json({
      status: 'ERROR',
      message: error instanceof Error ? error.message : 'An unknown error occurred'
    });
  }
});

// Configuración de CORS mejorada
const allowedOrigins = [
  'https://savingtimeoficial-production.up.railway.app',
  'http://localhost:3000',
  'http://localhost:5000',
  'http://localhost:8080',
  process.env.FRONTEND_URL // Añadir URL de producción si existe
].filter(Boolean); // Elimina valores undefined/null

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`Origin not allowed: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de logging básico
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// Middleware de manejo de errores
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Archivos estáticos
const uploadPath = path.join(__dirname, '../uploads');
console.log('Upload path:', uploadPath);
app.use('/uploads', express.static(uploadPath));

// Inicializar asociaciones
initializeAssociations();

// Rutas API
const apiRouter = express.Router();
apiRouter.use('/auth', authRoutes);
apiRouter.use('/users', userRoutes);
apiRouter.use('/posts', postRoutes);
apiRouter.use('/roles', roleRoutes);
apiRouter.use('/likes', likeRoutes);
apiRouter.use('/comments', commentRoutes);
app.use('/api', apiRouter);

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
    // Verificar variables de entorno críticas
    const requiredEnvVars = ['MYSQLUSER', 'MYSQLPASSWORD', 'MYSQLHOST'];
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    if (missingVars.length > 0) {
      throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }

    // Conectar a la base de datos
    await sequelize.authenticate();
    console.log('✅ Base de datos conectada.');

    // Sincronizar modelos (considera usar migrations en producción)
    await sequelize.sync({ alter: true });
    console.log('✅ Modelos sincronizados.');

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`
🚀 Servidor iniciado exitosamente
📡 Puerto: ${PORT}
🌍 Ambiente: ${process.env.NODE_ENV || 'development'}
🔗 URL: http://localhost:${PORT}
      `);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    // Esperar un poco antes de salir para asegurar que los logs se escriban
    setTimeout(() => process.exit(1), 1000);
  }
};

// Manejo de señales de terminación
process.on('SIGTERM', () => {
  console.log('SIGTERM recibido. Cerrando servidor...');
  process.exit(0);
});

startServer();

export default app;