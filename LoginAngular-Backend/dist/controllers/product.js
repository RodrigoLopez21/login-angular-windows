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
exports.DeleteProduct = exports.UpdateProduct = exports.CreateProduct = exports.ReadIdProductId = exports.ReadProduct = void 0;
const product_1 = require("../models/product");
const ReadProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const listProduct = yield product_1.Product.findAll();
    res.json(listProduct);
});
exports.ReadProduct = ReadProduct;
const ReadIdProductId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { Pid } = req.params;
    try {
        const product = yield product_1.Product.findOne({ where: { Pid: Pid } });
        if (!product) {
            return res.status(404).json({
                msg: `Product con ID ${Pid} no encontrada`
            });
        }
        return res.json({
            msg: `Product con ID ${Pid} encontrada exitosamente`,
            data: product
        });
    }
    catch (error) {
        return res.status(500).json({
            msg: `Error al buscar la Product con ID ${Pid}`
        });
    }
});
exports.ReadIdProductId = ReadIdProductId;
const CreateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { Pname, Pdescription, CategoryId } = req.body;
    try {
        const existingProduct = yield product_1.Product.findOne({ where: { Pname: Pname } });
        if (existingProduct) {
            return res.status(400).json({
                msg: `Producto ${Pname}, ya existe`
            });
        }
        product_1.Product.create({
            Pname: Pname,
            Pdescription: Pdescription,
            Pstatus: 1,
            CategoryId: CategoryId
        });
        return res.json({
            msg: `Producto ${Pname}, creada exitosamente`
        });
    }
    catch (error) {
        return res.json({
            msg: `Error al crear la product ${Pname}`
        });
    }
});
exports.CreateProduct = CreateProduct;
const UpdateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { Pid } = req.params;
    const { Pname, Pdescription, Pstatus, CategoryId } = req.body;
    try {
        const product = yield product_1.Product.findOne({ where: { Pid: Pid } });
        if (!product) {
            return res.status(404).json({
                msg: `Producto ${Pname} no encontrada`
            });
        }
        console.log("Estoy por aqui ****** =>" + product.Pid);
        console.log("Estoy por aqui ****** =>" + Pname);
        yield product_1.Product.update({
            Pname: Pname,
            Pdescription: Pdescription,
            Pstatus: 1,
            CategoryId: CategoryId
        }, { where: { Pid: Pid } });
        console.log("Estoy por aqui ******");
        return res.json({
            msg: `Producto ${Pname} actualizada exitosamente`
        });
    }
    catch (error) {
        return res.status(500).json({
            msg: `Error al actualizar la Producto ${Pname}`
        });
    }
});
exports.UpdateProduct = UpdateProduct;
const DeleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { Pid } = req.params;
    try {
        const product = yield product_1.Product.findOne({ where: { Pid: Pid } });
        if (!product) {
            return res.status(404).json({
                msg: `Producto con ID ${Pid} no encontrada`
            });
        }
        yield product_1.Product.destroy({ where: { Pid: Pid } });
        return res.json({
            msg: `Producto con ID ${Pid} eliminada exitosamente`
        });
    }
    catch (error) {
        return res.status(500).json({
            msg: `Error al eliminar la Producto con ID ${Pid}`
        });
    }
});
exports.DeleteProduct = DeleteProduct;
