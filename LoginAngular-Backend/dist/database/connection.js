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
Object.defineProperty(exports, "__esModule", { value: true });
exports.testConnection = void 0;
const sequelize_1 = require("sequelize");
const sequelize = new sequelize_1.Sequelize(process.env.DB_NAME || 'test', process.env.DB_USER || 'root', process.env.DB_PASS, {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql', // ¡Esta es la corrección clave!
    port: Number(process.env.DB_PORT) || 3306,
    logging: false, // Desactiva los logs de SQL en la consola para mayor claridad
});
const testConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield sequelize.authenticate();
        console.log('Conexión a la base de datos establecida exitosamente.');
    }
    catch (error) {
        console.error('No se pudo conectar a la base de datos:', error);
        // Es una buena práctica terminar el proceso si la DB no está disponible
        process.exit(1);
    }
});
exports.testConnection = testConnection;
exports.default = sequelize;
