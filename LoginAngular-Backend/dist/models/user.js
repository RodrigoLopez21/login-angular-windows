"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../database/connection"));
exports.User = connection_1.default.define("user", {
    Uid: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    Uname: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    Ulastname: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    Uemail: { type: sequelize_1.DataTypes.STRING, unique: true, allowNull: false },
    Upassword: { type: sequelize_1.DataTypes.STRING, unique: true, allowNull: false },
    Ucredential: { type: sequelize_1.DataTypes.STRING, unique: true, allowNull: false },
    Ustatus: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
});
