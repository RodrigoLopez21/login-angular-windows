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
exports.DeleteCategory = exports.UpdateCategory = exports.CreateCategory = exports.ReadCategoryId = exports.ReadCategory = void 0;
const category_1 = require("../models/category");
const ReadCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const listCategory = yield category_1.Category.findAll();
    res.json(listCategory);
    // res.json({
    //     msg: `List de categoría encontrada exitosamente`,
    //     data: listCategory
    // });
});
exports.ReadCategory = ReadCategory;
const ReadCategoryId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { Cid } = req.params;
    try {
        const category = yield category_1.Category.findOne({ where: { Cid: Cid } });
        if (!category) {
            return res.status(404).json({
                msg: `Categoría con ID ${Cid} no encontrada`
            });
        }
        return res.json({
            msg: `Categoría con ID ${Cid} encontrada exitosamente`,
            data: category
        });
    }
    catch (error) {
        return res.status(500).json({
            msg: `Error al buscar la categoría con ID ${Cid}`
        });
    }
});
exports.ReadCategoryId = ReadCategoryId;
const CreateCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { Cname, Cdescription } = req.body;
    const category = yield category_1.Category.findOne({ where: { Cname: Cname } });
    if (category) {
        return res.status(400).json({
            msg: `Categoria ${Cname}, ya existe`
        });
    }
    try {
        category_1.Category.create({
            Cname: Cname,
            Cdescription: Cdescription,
            Cstatus: 1
        });
        return res.json({
            msg: `Categoria ${Cname}, creada exitosamente`
        });
    }
    catch (error) {
        return res.json({
            msg: `Error al crear la categoria ${Cname}`
        });
    }
});
exports.CreateCategory = CreateCategory;
const UpdateCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { Cid } = req.params;
    const { Cname, Cdescription, Cstatus } = req.body;
    try {
        const category = yield category_1.Category.findOne({ where: { Cid: Cid } });
        if (!category) {
            return res.status(404).json({
                msg: `Categoría ${Cname} no encontrada`
            });
        }
        yield category_1.Category.update({
            Cname: Cname,
            Cdescription: Cdescription,
            Cstatus: Cstatus
        }, { where: { Cid: Cid } });
        return res.json({
            msg: `Categoría ${Cname} actualizada exitosamente`
        });
    }
    catch (error) {
        return res.status(500).json({
            msg: `Error al actualizar la categoría ${Cname}`
        });
    }
});
exports.UpdateCategory = UpdateCategory;
const DeleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { Cid } = req.params;
    try {
        const category = yield category_1.Category.findOne({ where: { Cid: Cid } });
        if (!category) {
            return res.status(404).json({
                msg: `Categoría con ID ${Cid} no encontrada`
            });
        }
        yield category_1.Category.destroy({ where: { Cid: Cid } });
        return res.json({
            msg: `Categoría con ID ${Cid} eliminada exitosamente`
        });
    }
    catch (error) {
        return res.status(500).json({
            msg: `Error al eliminar la categoría con ID ${Cid}`
        });
    }
});
exports.DeleteCategory = DeleteCategory;
