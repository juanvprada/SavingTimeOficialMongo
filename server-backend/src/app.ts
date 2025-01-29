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
const PORT = process.env.PORT || 5000;

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5000',
    'http://localhost:5173',
    'http://localhost:8080',
    'https://tu-dominio-evennode.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token'],
  exposedHeaders: ['*', 'Authorization']
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

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
    // Create a simple default image or copy from assets
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
app.use('/uploads', (req, res, next) => {
  express.static(uploadPath, {
    setHeaders: (res, path) => {
      if (path.endsWith('.jpg') || path.endsWith('.jpeg')) {
        res.setHeader('Content-Type', 'image/jpeg');
      } else if (path.endsWith('.png')) {
        res.setHeader('Content-Type', 'image/png');
      }
    }
  })(req, res, next);
});

// API Routes
const apiRouter = express.Router();
apiRouter.use('/auth', authRoutes);
apiRouter.use('/users', userRoutes);
apiRouter.use('/posts', postRoutes);
apiRouter.use('/roles', roleRoutes);
apiRouter.use('/likes', likeRoutes);
apiRouter.use('/comments', commentRoutes);
app.use('/api', apiRouter);

// Test endpoint for uploads directory
app.get('/test-uploads', (req, res) => {
  try {
    const files = fs.readdirSync(uploadPath);
    res.json({
      message: 'Uploads directory content',
      files,
      uploadPath,
      defaultImageExists: fs.existsSync(defaultImagePath)
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error checking uploads directory',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

if (process.env.NODE_ENV === 'production') {
  const frontendBuildPath = path.join(__dirname, '../../client-frontend/dist');
  app.use(express.static(frontendBuildPath));

  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendBuildPath, 'index.html'));
  });
}

// MongoDB Connection
mongoose
  .connect(CONFIG.DB.URI)
  .then(() => console.log('✅ MongoDB connection established.'))
  .catch((err: Error) => {
    console.error('❌ Error connecting to MongoDB:', err);
    process.exit(1);
  });

// Start server
// app.listen(PORT, () => {
//   console.log(`🚀 Server running at http://localhost:${PORT}`);
//   console.log(`📁 Uploads directory: ${uploadPath}`);
// });

export default app;