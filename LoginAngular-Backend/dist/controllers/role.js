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
exports.DeleteRole = exports.UpdateRole = exports.CreateRole = exports.ReadRoleId = exports.ReadRole = void 0;
const role_1 = require("../models/role");
const xss_1 = __importDefault(require("xss"));
const ReadRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const listRole = yield role_1.Role.findAll();
    res.json(listRole);
});
exports.ReadRole = ReadRole;
const ReadRoleId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { Rid } = req.params;
    try {
        const role = yield role_1.Role.findOne({ where: { Rid: Rid } });
        if (!role) {
            return res.status(404).json({
                msg: `Rol con ID ${Rid} no encontrada`
            });
        }
        return res.json({
            msg: `Rol con ID ${Rid} encontrada exitosamente`,
            data: role
        });
    }
    catch (error) {
        return res.status(500).json({
            msg: `Error al buscar la Rol con ID ${Rid}`
        });
    }
});
exports.ReadRoleId = ReadRoleId;
const CreateRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const Rname = (0, xss_1.default)(req.body.Rname);
    const role = yield role_1.Role.findOne({ where: { Rname: Rname } });
    if (role) {
        return res.status(400).json({
            msg: `Rol ${Rname}, ya existe`
        });
    }
    try {
        role_1.Role.create({
            Rname: Rname,
            Rstatus: 1
        });
        return res.json({
            msg: `Rol ${Rname}, creada exitosamente`
        });
    }
    catch (error) {
        return res.json({
            msg: `Error al crear la Rol ${Rname}`
        });
    }
});
exports.CreateRole = CreateRole;
const UpdateRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const Rid = (0, xss_1.default)(req.params.Rid);
    const Rname = (0, xss_1.default)(req.body.Rname);
    const Rstatus = (0, xss_1.default)(req.body.Rstatus);
    try {
        const role = yield role_1.Role.findOne({ where: { Rid: Rid } });
        if (!role) {
            return res.status(404).json({
                msg: `Rol ${Rname} no encontrada`
            });
        }
        yield role_1.Role.update({
            Rname: Rname,
            Rstatus: Rstatus
        }, { where: { Rid: Rid } });
        return res.json({
            msg: `Rol ${Rname} actualizada exitosamente`
        });
    }
    catch (error) {
        return res.status(500).json({
            msg: `Error al actualizar la Rol ${Rname}`
        });
    }
});
exports.UpdateRole = UpdateRole;
const DeleteRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { Rid } = req.params;
    try {
        const role = yield role_1.Role.findOne({ where: { Rid: Rid } });
        if (!role) {
            return res.status(404).json({
                msg: `Rol con ID ${Rid} no encontrada`
            });
        }
        yield role_1.Role.destroy({ where: { Rid: Rid } });
        return res.json({
            msg: `Rol con ID ${Rid} eliminada exitosamente`
        });
    }
    catch (error) {
        return res.status(500).json({
            msg: `Error al eliminar la Rol con ID ${Rid}`
        });
    }
});
exports.DeleteRole = DeleteRole;
