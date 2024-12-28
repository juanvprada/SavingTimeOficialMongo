import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USER as string,
  process.env.DB_PASSWORD as string,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false,
  }
);

// Probar la conexión
sequelize.authenticate()
  .then(() => console.log('Conexión a la base de datos con Sequelize exitosa'))
  .catch(err => console.error('Error de conexión a la base de datos:', err));
