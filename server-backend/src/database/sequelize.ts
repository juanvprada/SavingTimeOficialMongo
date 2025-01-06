// database/sequelize.ts
import { Sequelize } from 'sequelize';
import mysql from 'mysql2/promise';
import { CONFIG } from '../config/constants';

const getSequelizeConfig = () => {
  if (process.env.MYSQL_URL) {
    return new Sequelize(process.env.MYSQL_URL, {
      dialect: 'mysql',
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      },
      logging: false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    });
  }

  return new Sequelize(
    CONFIG.DB.NAME,
    CONFIG.DB.USER,
    CONFIG.DB.PASSWORD,
    {
      host: CONFIG.DB.HOST,
      dialect: 'mysql',
      logging: CONFIG.DB.LOGGING ? (msg: string) => console.log(msg) : false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    }
  );
};

export const sequelize = getSequelizeConfig();

export const mysqlPool = mysql.createPool(
  process.env.MYSQL_URL 
    ? { uri: process.env.MYSQL_URL }
    : {
        host: CONFIG.DB.HOST,
        user: CONFIG.DB.USER,
        password: CONFIG.DB.PASSWORD,
        database: CONFIG.DB.NAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
      }
);