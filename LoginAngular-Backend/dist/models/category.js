"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../database/connection"));
exports.Category = connection_1.default.define("category", {
    Cid: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    Cname: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    Cdescription: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    Cstatus: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    CcreatedAt: { type: sequelize_1.DataTypes.DATE, field: 'Ccreated', defaultValue: sequelize_1.DataTypes.NOW, allowNull: false },
    CupdatedAt: { type: sequelize_1.DataTypes.DATE, field: 'Cupdated', defaultValue: sequelize_1.DataTypes.NOW, allowNull: false },
    CdeletedAt: { type: sequelize_1.DataTypes.DATE, field: 'Cdeleted', defaultValue: sequelize_1.DataTypes.NOW, allowNull: false },
}, {
    timestamps: false,
    paranoid: false
});
