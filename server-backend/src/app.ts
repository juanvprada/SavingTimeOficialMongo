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

// Debugging de variables de entorno
console.log('Environment variables:');
console.log('MYSQL_URL:', process.env.MYSQL_URL);
console.log('MYSQLHOST:', process.env.MYSQLHOST);
console.log('MYSQLDATABASE:', process.env.MYSQLDATABASE);

const app = express();
const PORT = process.env.PORT || 8080;

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

// Inicializar asociaciones
initializeAssociations();

app.use(express.json());

const uploadPath = path.join(__dirname, '../uploads');
console.log('Upload path:', uploadPath);
app.use('/uploads', express.static(uploadPath));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/comments', commentRoutes);

const publicPath = path.join(__dirname, '../public');
app.use(express.static(publicPath));

app.get('*', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

// Sincronizar base de datos antes de iniciar el servidor
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Base de datos sincronizada');
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error al sincronizar la base de datos:', error);
  });

export default app;