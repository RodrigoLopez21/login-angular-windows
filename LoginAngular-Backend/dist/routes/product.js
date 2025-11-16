"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_1 = require("../controllers/product");
const validateToken_1 = __importDefault(require("../routes/validateToken"));
const router = (0, express_1.Router)();
// Rutas Públicas (Cualquiera puede ver los productos)
router.get("/api/product/read", product_1.ReadProduct);
// Rutas Protegidas (Solo usuarios con token válido pueden modificar)
router.post("/api/product/create", validateToken_1.default, product_1.CreateProduct);
router.patch("/api/product/update/:Pid", validateToken_1.default, product_1.UpdateProduct);
router.delete("/api/product/delete/:Pid", validateToken_1.default, product_1.DeleteProduct);
exports.default = router;
