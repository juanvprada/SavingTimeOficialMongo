"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.baseModelSchema = void 0;
const mongoose_1 = require("mongoose");
exports.baseModelSchema = new mongoose_1.Schema({
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});
