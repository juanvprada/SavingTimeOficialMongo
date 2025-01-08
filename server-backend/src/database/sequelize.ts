import { Sequelize } from 'sequelize';

// Verificación de variables de entorno requeridas
const requiredEnvVars = ['MYSQLUSER', 'MYSQLPASSWORD', 'MYSQLHOST', 'MYSQLPORT', 'MYSQLDATABASE'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Faltan variables de entorno requeridas:', missingVars);
  process.exit(1);
}

// Log de variables disponibles (seguro)
console.log('=== Variables de entorno disponibles ===');
console.log('Host:', process.env.MYSQLHOST);
console.log('Port:', process.env.MYSQLPORT);
console.log('Database:', process.env.MYSQLDATABASE);
console.log('User:', process.env.MYSQLUSER);
console.log('Password: ********');

let sequelize: Sequelize;

try {
  // Crear instancia de Sequelize
  sequelize = new Sequelize({
    dialect: 'mysql',
    host: process.env.MYSQLHOST,
    port: parseInt(process.env.MYSQLPORT!),
    username: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
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
    logging: false,
    retry: {
      max: 3
    }
  });

  // Test de conexión inmediato
  sequelize
    .authenticate()
    .then(() => {
      console.log('✅ Conexión a MySQL establecida correctamente');
    })
    .catch((err) => {
      console.error('❌ Error de conexión:', {
        message: err.message,
        code: err.parent?.code,
        errno: err.parent?.errno,
        host: err.parent?.host,
        port: err.parent?.port
      });
    });

} catch (error) {
  console.error('❌ Error al crear instancia de Sequelize:', error);
  process.exit(1);
}

export { sequelize };