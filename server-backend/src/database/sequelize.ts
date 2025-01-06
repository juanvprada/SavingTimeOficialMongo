import { Sequelize } from 'sequelize';
import mysql from 'mysql2/promise';

// Debugging
console.log('=== Database Configuration ===');
console.log('Current ENV:', {
  host: process.env.MYSQLHOST,
  port: process.env.MYSQLPORT,
  database: process.env.MYSQLDATABASE,
  user: process.env.MYSQLUSER
});

// Configuración de la base de datos
const dbConfig = {
  host: process.env.MYSQLHOST || 'localhost',
  port: parseInt(process.env.MYSQLPORT || '3306'),
  database: process.env.MYSQLDATABASE || 'railway',
  username: process.env.MYSQLUSER || 'root',
  password: process.env.MYSQLPASSWORD || '',
  dialect: 'mysql' as const,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  logging: console.log
};

console.log('Using configuration:', {
  ...dbConfig,
  password: '[HIDDEN]'
});

export const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    dialectOptions: dbConfig.dialectOptions,
    logging: dbConfig.logging
  }
);

// Test inicial de conexión
sequelize
  .authenticate()
  .then(() => {
    console.log('Conexión inicial establecida correctamente');
  })
  .catch((err) => {
    console.error('Error al conectar:', err);
  });

export const mysqlPool = mysql.createPool({
  host: dbConfig.host,
  port: dbConfig.port,
  user: dbConfig.username,
  password: dbConfig.password,
  database: dbConfig.database
});