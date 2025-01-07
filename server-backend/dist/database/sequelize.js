"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
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
    database: process.env.MYSQLDATABASE,
    username: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    host: process.env.MYSQLHOST,
    port: parseInt(process.env.MYSQLPORT),
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
const sequelize = new sequelize_1.Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    dialectOptions: dbConfig.dialectOptions,
    pool: dbConfig.pool,
    logging: dbConfig.logging
});
exports.sequelize = sequelize;
// Test de conexión
sequelize
    .authenticate()
    .then(() => {
    console.log('✅ Conexión a MySQL establecida correctamente');
})
    .catch((err) => {
    var _a, _b;
    console.error('❌ Error de conexión:', {
        message: err.message,
        code: (_a = err.parent) === null || _a === void 0 ? void 0 : _a.code,
        errno: (_b = err.parent) === null || _b === void 0 ? void 0 : _b.errno
    });
    process.exit(1); // Detener la aplicación si no se puede conectar
});
