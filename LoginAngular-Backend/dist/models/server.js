"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const helmet_1 = __importDefault(require("helmet"));
const connection_1 = __importStar(require("../database/connection"));
const category_1 = __importDefault(require("../routes/category"));
const product_1 = __importDefault(require("../routes/product"));
const role_1 = __importDefault(require("../routes/role"));
const user_1 = __importDefault(require("../routes/user"));
const login_history_1 = __importDefault(require("../routes/login_history"));
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.port = process.env.PORT || '3001';
        this.middlewares();
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
        this.app.use(login_history_1.default);
    }
    middlewares() {
        // Parseo del body
        this.app.use(express_1.default.json());
        // CORS
        this.app.use((0, cors_1.default)());
        // 🔐 Cabeceras de Seguridad con Helmet
        this.app.use((0, helmet_1.default)());
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
                // Sincronizamos TODOS los modelos de una sola vez.
                // En producción, es mejor usar migraciones en lugar de sync().
                yield connection_1.default.sync();
                console.log('Todos los modelos fueron sincronizados exitosamente.');
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
