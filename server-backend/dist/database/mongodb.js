"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/savingtimedb';
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(MONGODB_URI);
        console.log('✅ Conexión a MongoDB exitosa');
    }
    catch (error) {
        console.error('❌ Error de conexión a MongoDB:', error);
        process.exit(1);
    }
});
exports.connectDB = connectDB;
// Eventos de conexión
mongoose_1.default.connection.on('connected', () => {
    console.log('🌿 MongoDB conectado');
});
mongoose_1.default.connection.on('error', (err) => {
    console.error('❌ Error de MongoDB:', err);
});
mongoose_1.default.connection.on('disconnected', () => {
    console.log('🔌 MongoDB desconectado');
});
// Manejo de cierre de la aplicación
process.on('SIGINT', () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connection.close();
        console.log('MongoDB desconectado por cierre de la aplicación');
        process.exit(0);
    }
    catch (err) {
        console.error('Error al cerrar la conexión de MongoDB:', err);
        process.exit(1);
    }
}));
