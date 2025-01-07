"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
// Debugging al inicio
console.log('=== Process ENV Keys ===');
console.log('Available environment variables:', Object.keys(process.env));
// Construir URL de conexión
const MYSQL_URL = `mysql://${process.env.MYSQLUSER}:${process.env.MYSQLPASSWORD}@${process.env.MYSQLHOST}:${process.env.MYSQLPORT}/${process.env.MYSQLDATABASE}`;
// Log seguro de la URL (ocultar contraseña)
console.log('Connection URL (sanitized):', MYSQL_URL.replace(/:[^:@]+@/, ':****@'));
// Declarar sequelize fuera del try
let sequelize;
try {
    // Crear la instancia de Sequelize con URL directa
    exports.sequelize = sequelize = new sequelize_1.Sequelize(MYSQL_URL, {
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
        var _a, _b, _c, _d;
        console.error('❌ Error de conexión:', {
            message: err.message,
            code: (_a = err.parent) === null || _a === void 0 ? void 0 : _a.code,
            errno: (_b = err.parent) === null || _b === void 0 ? void 0 : _b.errno,
            host: (_c = err.parent) === null || _c === void 0 ? void 0 : _c.host,
            port: (_d = err.parent) === null || _d === void 0 ? void 0 : _d.port
        });
    });
}
catch (error) {
    console.error('❌ Error al crear instancia de Sequelize:', error);
    process.exit(1);
}
