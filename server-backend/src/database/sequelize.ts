import { Sequelize } from 'sequelize';
import mysql from 'mysql2/promise';

console.log('=== Environment Variables Check ===');
const envVars = [
  'MYSQL_URL',
  'MYSQLHOST',
  'MYSQLPORT',
  'MYSQLUSER',
  'MYSQLPASSWORD',
  'MYSQLDATABASE'
];

envVars.forEach(varName => {
  console.log(`${varName} is ${process.env[varName] ? 'set' : 'not set'}`);
});

const sequelize = new Sequelize({
  host: process.env.MYSQLHOST || 'localhost',
  port: parseInt(process.env.MYSQLPORT || '3306'),
  database: process.env.MYSQLDATABASE || 'railway',
  username: process.env.MYSQLUSER || 'root',
  password: process.env.MYSQLPASSWORD || '',
  dialect: 'mysql',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  logging: false
});

// Test de conexión
sequelize
  .authenticate()
  .then(() => {
    console.log('Conexión a la base de datos establecida con éxito.');
  })
  .catch((err) => {
    console.error('Error detallado de conexión:', {
      host: process.env.MYSQLHOST,
      port: process.env.MYSQLPORT,
      database: process.env.MYSQLDATABASE,
      user: process.env.MYSQLUSER
    });
    console.error('Error de conexión:', err);
  });

export { sequelize };