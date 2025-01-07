import { Sequelize } from 'sequelize';

// Debugging detallado al inicio
console.log('=== Process ENV Keys ===');
console.log('Available environment variables:', Object.keys(process.env));

// Validación de variables requeridas
const requiredVars = ['MYSQLHOST', 'MYSQLPORT', 'MYSQLUSER', 'MYSQLPASSWORD', 'MYSQLDATABASE'];
const missingVars = requiredVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingVars);
  process.exit(1); // Detener la aplicación si faltan variables
}

// Configuración de la conexión
const dbConfig = {
  database: process.env.MYSQLDATABASE!,
  username: process.env.MYSQLUSER!,
  password: process.env.MYSQLPASSWORD!,
  host: process.env.MYSQLHOST!,
  port: parseInt(process.env.MYSQLPORT!),
  dialect: 'mysql' as const,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  logging: false
};

console.log('=== Database Configuration ===');
console.log({
  host: dbConfig.host,
  port: dbConfig.port,
  database: dbConfig.database,
  username: dbConfig.username,
  dialect: dbConfig.dialect
});

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    dialectOptions: dbConfig.dialectOptions,
    pool: dbConfig.pool,
    logging: dbConfig.logging
  }
);

// Test de conexión
sequelize
  .authenticate()
  .then(() => {
    console.log('✅ Conexión a MySQL establecida correctamente');
  })
  .catch((err) => {
    console.error('❌ Error de conexión:', {
      message: err.message,
      code: err.parent?.code,
      errno: err.parent?.errno
    });
    process.exit(1); // Detener la aplicación si no se puede conectar
  });

export { sequelize };