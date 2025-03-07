import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { CONFIG } from './config/constants';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import postRoutes from './routes/postRoutes';
import roleRoutes from './routes/roleRoutes';
import likeRoutes from './routes/likeRoutes';
import commentRoutes from './routes/commentRoutes';
import statisticsRoutes from './routes/statisticsRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
app.use(cors({
  origin: [
    'https://savingtimeoficial.eu-4.evennode.com',
    'http://localhost:3000',
    'http://localhost:5000',
    'http://localhost:5173',
    'http://localhost:8080'
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

// API Routes
const apiRouter = express.Router();
apiRouter.use('/auth', authRoutes);
apiRouter.use('/users', userRoutes);
apiRouter.use('/posts', postRoutes);
apiRouter.use('/roles', roleRoutes);
apiRouter.use('/likes', likeRoutes);
apiRouter.use('/comments', commentRoutes);
apiRouter.use('/statistics', statisticsRoutes);
app.use('/api', apiRouter);


if (process.env.NODE_ENV === 'production') {
  const path = require('path');
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

export default app;