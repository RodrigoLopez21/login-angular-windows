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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const connection_1 = require("../database/connection");
const category_1 = __importDefault(require("../routes/category"));
const product_1 = __importDefault(require("../routes/product"));
const role_1 = __importDefault(require("../routes/role"));
const user_1 = __importDefault(require("../routes/user"));
const category_2 = require("./category");
const product_2 = require("./product");
const role_2 = require("./role");
const user_2 = require("./user");
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.port = process.env.PORT || '3001';
        this.midlewares();
        this.router();
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log("La aplicación se esta corriendo exitosamente en el puerto => " + this.port);
        });
    }
    router() {
        this.app.use(category_1.default);
        this.app.use(product_1.default);
        this.app.use(role_1.default);
        this.app.use(user_1.default);
    }
    midlewares() {
        // Parseo del body
        this.app.use(express_1.default.json());
        // CORS
        this.app.use((0, cors_1.default)());
        // 🔐 Evitar MIME Sniffing
        this.app.use((req, res, next) => {
            res.setHeader("X-Content-Type-Options", "nosniff");
            next();
        });
        // 🔐 Ocultar que la app corre en Express
        this.app.disable("x-powered-by");
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // 1. Sincronizar modelos y probar conexión a la DB
                yield this.DBconnetc();
                // 2. Iniciar el servidor solo si la conexión a la DB es exitosa
                this.listen();
            }
            catch (error) {
                console.error('Fallo al inicializar el servidor:', error);
                process.exit(1);
            }
        });
    }
    DBconnetc() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // await Product.sync({force: true}); // Clean date of table
                yield category_2.Category.sync();
                yield product_2.Product.sync();
                // await User.sync({alter: true}); // Update atribute of table
                yield role_2.Role.sync();
                yield user_2.User.sync();
                yield (0, connection_1.testConnection)(); // Reutilizamos la función para mostrar el mensaje de éxito
            }
            catch (error) {
                console.error("Error en la conexión a la base de datos => ", error);
                throw error; // Lanzamos el error para que initialize() lo capture
            }
        });
    }
}
exports.default = Server;
