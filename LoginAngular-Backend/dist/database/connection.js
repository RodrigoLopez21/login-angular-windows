"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize = new sequelize_1.Sequelize('loginangular', 'usuario_app', 'contraseña_segura', {
    dialect: 'mysql',
    host: 'localhost',
    port: 3306,
    logging: false
});
exports.default = sequelize;
