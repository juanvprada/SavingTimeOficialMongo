"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.baseModelConfig = exports.BaseSequelizeModel = void 0;
const sequelize_1 = require("sequelize");
class BaseSequelizeModel extends sequelize_1.Model {
    // Definimos el método associate como abstracto en la clase
    static associate(models) { }
}
exports.BaseSequelizeModel = BaseSequelizeModel;
exports.baseModelConfig = {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
};
