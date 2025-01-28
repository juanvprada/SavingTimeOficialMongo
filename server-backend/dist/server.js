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
// src/server.ts
const app_1 = __importDefault(require("./app"));
const constants_1 = require("./config/constants");
const mongoose_1 = __importDefault(require("mongoose"));
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect(constants_1.CONFIG.DB.URI);
            console.log('✅ MongoDB connection established.');
            app_1.default.listen(constants_1.CONFIG.PORT, () => {
                console.log(`🚀 Server running at http://localhost:${constants_1.CONFIG.PORT}`);
            });
        }
        catch (error) {
            console.error('❌ Error al iniciar el servidor:', error);
            process.exit(1);
        }
    });
}
startServer();
