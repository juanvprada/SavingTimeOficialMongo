import { Sequelize } from 'sequelize';
import mysql from 'mysql2/promise';
import { CONFIG } from '../config/constants';

// Conexión Sequelize
export const sequelize = new Sequelize(
  CONFIG.DB.NAME,
  CONFIG.DB.USER,
  CONFIG.DB.PASSWORD,
  {
    host: CONFIG.DB.HOST,
    dialect: 'mysql',
    logging: CONFIG.DB.LOGGING ? (msg) => console.log(msg) : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Pool de conexiones MySQL
export const mysqlPool = mysql.createPool({
  host: CONFIG.DB.HOST,
  user: CONFIG.DB.USER,
  password: CONFIG.DB.PASSWORD,
  database: CONFIG.DB.NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});