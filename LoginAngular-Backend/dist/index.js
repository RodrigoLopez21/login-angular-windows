"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
// Carga las variables de entorno ANTES que cualquier otra cosa.
// Esto es crucial para que el resto de la aplicación tenga acceso a process.env
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../.env') });
const server_1 = __importDefault(require("./models/server"));
// Inicia el servidor
const server = new server_1.default();
server.initialize(); // Usamos el método initialize para conectar a la DB antes de escuchar
