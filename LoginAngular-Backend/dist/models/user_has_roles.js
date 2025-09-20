"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserHasRoles = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../database/connection"));
exports.UserHasRoles = connection_1.default.define("user_has_roles", {
    Uid: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true },
    Rid: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true }
});
