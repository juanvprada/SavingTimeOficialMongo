import { Sequelize } from 'sequelize';

// Debugging al inicio
console.log('=== Process ENV Keys ===');
console.log('Available environment variables:', Object.keys(process.env));

// Construir URL de conexión
const MYSQL_URL = `mysql://${process.env.MYSQLUSER}:${process.env.MYSQLPASSWORD}@${process.env.MYSQLHOST}:${process.env.MYSQLPORT}/${process.env.MYSQLDATABASE}`;

// Log seguro de la URL (ocultar contraseña)
console.log('Connection URL (sanitized):', MYSQL_URL.replace(/:[^:@]+@/, ':****@'));

// Declarar sequelize fuera del try
let sequelize: Sequelize;

try {
  // Crear la instancia de Sequelize con URL directa
  sequelize = new Sequelize(MYSQL_URL, {
    dialect: 'mysql',
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

// Export al final del archivo
export { sequelize };