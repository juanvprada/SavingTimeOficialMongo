import app from './app';
import { CONFIG } from './config/constants';
import { sequelize } from './database/sequelize';

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida correctamente.');

    app.listen(CONFIG.PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${CONFIG.PORT}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
}

startServer();