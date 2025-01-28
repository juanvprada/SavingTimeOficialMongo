import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/savingtimedb';

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conexión a MongoDB exitosa');
  } catch (error) {
    console.error('❌ Error de conexión a MongoDB:', error);
    process.exit(1);
  }
};

// Eventos de conexión
mongoose.connection.on('connected', () => {
  console.log('🌿 MongoDB conectado');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Error de MongoDB:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('🔌 MongoDB desconectado');
});

// Manejo de cierre de la aplicación
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB desconectado por cierre de la aplicación');
    process.exit(0);
  } catch (err) {
    console.error('Error al cerrar la conexión de MongoDB:', err);
    process.exit(1);
  }
});