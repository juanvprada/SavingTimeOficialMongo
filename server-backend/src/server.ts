// src/server.ts
import app from './app';
import { CONFIG } from './config/constants';
import mongoose from 'mongoose';

async function startServer() {
  try {
    await mongoose.connect(CONFIG.DB.URI);
    console.log('✅ MongoDB connection established.');

    app.listen(CONFIG.PORT, () => {
      console.log(`🚀 Server running at http://localhost:${CONFIG.PORT}`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
}

startServer();