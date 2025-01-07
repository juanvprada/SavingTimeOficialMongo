// sequelize.ts
import { Sequelize } from 'sequelize';

// Debugging detallado
console.log('=== MySQL Connection Details ===');
console.log({
  MYSQL_URL_exists: !!process.env.MYSQL_URL,
  MYSQLHOST: process.env.MYSQLHOST,
  MYSQLPORT: process.env.MYSQLPORT,
  MYSQLDATABASE: process.env.MYSQLDATABASE,
  MYSQLUSER: process.env.MYSQLUSER,
  MYSQLPASSWORD_exists: !!process.env.MYSQLPASSWORD
});

// Crear la conexión usando la URL completa
const sequelize = new Sequelize(process.env.MYSQL_URL!, {
  dialect: 'mysql',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    },
    connectTimeout: 60000
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  retry: {
    max: 3
  },
  logging: false
});

// Test de conexión con más detalles
sequelize
  .authenticate()
  .then(() => {
    console.log('✅ Conexión a MySQL establecida correctamente');
  })
  .catch((err) => {
    console.error('❌ Error de conexión detallado:', {
      message: err.message,
      name: err.name,
      stack: err.stack,
      parent: {
        code: err.parent?.code,
        errno: err.parent?.errno,
        sqlState: err.parent?.sqlState,
        hostname: err.parent?.hostname,
        fatal: err.parent?.fatal
      }
    });
  });

export { sequelize };