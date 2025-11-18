"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginHistory = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../database/connection"));
exports.LoginHistory = connection_1.default.define("login_history", {
    Lhid: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    Uid: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, references: { model: 'users', key: 'Uid' } },
    Lhlogin_time: { type: sequelize_1.DataTypes.DATE, allowNull: false, defaultValue: sequelize_1.DataTypes.NOW },
    Lhlogout_time: { type: sequelize_1.DataTypes.DATE, allowNull: true },
}, {
    timestamps: false
});
