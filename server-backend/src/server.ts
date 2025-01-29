import app from './app';
import { CONFIG } from './config/constants';
import mongoose from 'mongoose';

async function startServer() {
  try {
    await mongoose.connect(CONFIG.DB.URI);
    console.log('✅ MongoDB connection established.');

    app.listen(CONFIG.PORT, () => {
      console.log(`🚀 Server running on port ${CONFIG.PORT}`);
      console.log(`🔒 HTTPS enabled: ${process.env.NODE_ENV === 'production'}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
      console.log(`🔑 SSL Redirect: ${process.env.NODE_ENV === 'production'}`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
}

startServer();