"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const validateToken = (req, res, next) => {
    const headerToken = req.headers['authorization'];
    // console.log("VALIDATE TOKEN", headerToken);
    if (headerToken != undefined && headerToken.startsWith('Bearer ')) {
        try {
            const token = headerToken.slice(7);
            // console.log(token);        
            // Verify and attach decoded payload to request for downstream handlers
            const secret = process.env.SECRET_KEY || 'TSE-Edaniel-Valencia';
            const decoded = jsonwebtoken_1.default.verify(token, secret);
            // attach to request as `user`
            req.user = decoded;
            next();
        }
        catch (error) {
            res.status(401).json({
                msg: `CIERRE DE SESIÓN AUTOMATICO`
            });
        }
    }
    else {
        res.status(401).json({
            msg: `Acceso Denegado`
        });
    }
};
exports.default = validateToken;
