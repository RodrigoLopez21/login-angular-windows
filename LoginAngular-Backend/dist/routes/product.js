"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_1 = require("../controllers/product");
const validateToken_1 = __importDefault(require("./validateToken"));
const router = (0, express_1.Router)();
router.get("/api/product/read", validateToken_1.default, product_1.ReadProduct);
router.get("/api/product/read/:Pid", product_1.ReadIdProductId);
router.post("/api/product/create", product_1.CreateProduct);
router.patch("/api/product/update/:Pid", product_1.UpdateProduct);
router.delete("/api/product/delete/:Pid", product_1.DeleteProduct);
exports.default = router;
