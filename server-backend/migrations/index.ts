import { Sequelize } from 'sequelize';
import { CONFIG } from '../src/config/constants';
import { Umzug, SequelizeStorage } from 'umzug';

const sequelize = new Sequelize(
  CONFIG.DB.NAME,
  CONFIG.DB.USER,
  CONFIG.DB.PASSWORD,
  {
    host: CONFIG.DB.HOST,
    dialect: 'mysql'
  }
);

export const umzug = new Umzug({
  migrations: {
    glob: ['./migrations/*.ts', { cwd: __dirname }]
  },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: console
});