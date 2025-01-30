import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import mongoose from 'mongoose';
import { CONFIG } from './config/constants';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import postRoutes from './routes/postRoutes';
import roleRoutes from './routes/roleRoutes';
import likeRoutes from './routes/likeRoutes';
import commentRoutes from './routes/commentRoutes';

dotenv.config();

const app = express();

// Habilitar trust proxy para Evennode
app.enable('trust proxy');

// Debug logging middleware
app.use((req, res, next) => {
  console.log({
    method: req.method,
    url: req.url,
    protocol: req.protocol,
    secure: req.secure,
    hostname: req.hostname,
    headers: req.headers
  });
  next();
});

// Force HTTPS redirect
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production' && !req.secure) {
    console.log('Redirecting to HTTPS');
    return res.redirect(`https://${req.headers.host}${req.url}`);
  }
  next();
});

// CORS configuration
app.use(cors({
  origin: [
    'https://savingtimeoficial.eu-4.evennode.com',
    ...(process.env.NODE_ENV !== 'production' ? [
      'http://localhost:3000',
      'http://localhost:5000',
      'http://localhost:5173',
      'http://localhost:8080'
    ] : [])
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  exposedHeaders: ['Authorization'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Headers adicionales de seguridad
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files setup
const uploadPath = path.join(__dirname, '../uploads');

// Create uploads directory if it doesn't exist
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Ensure default image exists
const defaultImagePath = path.join(uploadPath, 'default.jpg');
if (!fs.existsSync(defaultImagePath)) {
  try {
    const defaultImageSource = path.join(__dirname, '../assets/default.jpg');
    if (fs.existsSync(defaultImageSource)) {
      fs.copyFileSync(defaultImageSource, defaultImagePath);
    } else {
      console.warn('Default image source not found at:', defaultImageSource);
    }
  } catch (error) {
    console.error('Error setting up default image:', error);
  }
}

// Serve static files with proper MIME types
app.use('/uploads', express.static(uploadPath, {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) {
      res.setHeader('Content-Type', 'image/jpeg');
    } else if (filePath.endsWith('.png')) {
      res.setHeader('Content-Type', 'image/png');
    }
  }
}));

// API Routes
const apiRouter = express.Router();

// API logging middleware
apiRouter.use((req, res, next) => {
  console.log('API Request:', {
    path: req.path,
    method: req.method,
    body: req.body
  });
  next();
});

apiRouter.use('/auth', authRoutes);
apiRouter.use('/users', userRoutes);
apiRouter.use('/posts', postRoutes);
apiRouter.use('/roles', roleRoutes);
apiRouter.use('/likes', likeRoutes);
apiRouter.use('/comments', commentRoutes);

// Montar todas las rutas API bajo /api
app.use('/api', apiRouter);

// API 404 handler
app.use('/api/*', (req, res) => {
  console.log('API 404:', req.originalUrl);
  res.status(404).json({ 
    message: 'API endpoint not found',
    path: req.originalUrl
  });
});

// Frontend setup for production
if (process.env.NODE_ENV === 'production') {
  const frontendBuildPath = path.join(__dirname, '../../client-frontend/dist');
  
  // Servir archivos estáticos
  app.use(express.static(frontendBuildPath));
  
  // Todas las demás rutas sirven index.html
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendBuildPath, 'index.html'));
  });
}

export default app;