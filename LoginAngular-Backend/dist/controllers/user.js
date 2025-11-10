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
exports.updateProfile = exports.getProfile = exports.LoginUser = exports.CreateUser = exports.ReadUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_1 = require("../models/user");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const xss_1 = __importDefault(require("xss"));
const ReadUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const listUser = yield user_1.User.findAll();
    res.json({
        msg: `List de categoría encontrada exitosamente`,
        data: listUser
    });
});
exports.ReadUser = ReadUser;
const CreateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Sanitiza los datos recibidos
    const Uname = (0, xss_1.default)(req.body.Uname);
    const Ulastname = (0, xss_1.default)(req.body.Ulastname);
    const Upassword = (0, xss_1.default)(req.body.Upassword);
    const Uemail = (0, xss_1.default)(req.body.Uemail);
    const Ucredential = (0, xss_1.default)(req.body.Ucredential);
    const userEmail = yield user_1.User.findOne({ where: { Uemail: Uemail } });
    const userCredential = yield user_1.User.findOne({ where: { Ucredential: Ucredential } });
    if (userEmail) {
        return res.status(400).json({
            msg: `Usuario ya existe con el email ${Uemail}`
        });
    }
    if (userCredential) {
        return res.status(400).json({
            msg: `Usuario ya existe con la credencial ${Ucredential}`
        });
    }
    const UpasswordHash = yield bcryptjs_1.default.hash(Upassword, 10);
    try {
        user_1.User.create({
            Uname: Uname,
            Ulastname: Ulastname,
            Uemail: Uemail,
            Upassword: UpasswordHash,
            Ucredential: Ucredential,
            Ustatus: 1
        });
        res.json({
            msg: `User ${Uname} ${Ulastname} create success.`
        });
    }
    catch (error) {
        res.status(400).json({
            msg: `Existe un error al crear el usuario => `, error
        });
    }
});
exports.CreateUser = CreateUser;
const LoginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { Uemail, Upassword } = req.body;
    const user = yield user_1.User.findOne({ where: { Uemail: Uemail } });
    if (!user) {
        return res.status(400).json({
            msg: `Usuario no existe con el email ${Uemail}`
        });
    }
    const passwordValid = yield bcryptjs_1.default.compare(Upassword, user.Upassword);
    if (!passwordValid) {
        return res.status(400).json({
            msg: `Password Incorrecto => ${Upassword}`
        });
    }
    // Incluye id, email y rol en el token
    const secretKey = process.env.SECRET_KEY;
    if (!secretKey) {
        console.error('Error Crítico: La variable de entorno SECRET_KEY no está definida.');
        return res.status(500).json({ msg: 'Error interno del servidor: la configuración de seguridad está incompleta.' });
    }
    const token = jsonwebtoken_1.default.sign({
        id: user.Uid,
        email: user.Uemail,
        rol: user.Ucredential
    }, secretKey);
    res.json({ token });
});
exports.LoginUser = LoginUser;
const getProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id; // Obtiene el ID del usuario del token
        const user = yield user_1.User.findByPk(userId);
        if (!user) {
            return res.status(404).json({
                msg: 'Usuario no encontrado'
            });
        }
        // Mapear los campos del backend a los del frontend
        res.json({
            id: user.Uid,
            firstName: user.Uname,
            lastName: user.Ulastname,
            email: user.Uemail,
            username: user.Ucredential
        });
    }
    catch (error) {
        res.status(500).json({
            msg: 'Error al obtener el perfil del usuario',
            error
        });
    }
});
exports.getProfile = getProfile;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const { firstName, lastName, email, password } = req.body;
        const user = yield user_1.User.findByPk(userId);
        if (!user) {
            return res.status(404).json({
                msg: 'Usuario no encontrado'
            });
        }
        // Actualizar los campos
        const updateData = {
            Uname: (0, xss_1.default)(firstName),
            Ulastname: (0, xss_1.default)(lastName),
            Uemail: (0, xss_1.default)(email)
        };
        // Si se proporciona una nueva contraseña, hashearla
        if (password) {
            updateData.Upassword = yield bcryptjs_1.default.hash((0, xss_1.default)(password), 10);
        }
        yield user.update(updateData);
        res.json({
            msg: 'Perfil actualizado correctamente',
            user: {
                id: user.Uid,
                firstName: user.Uname,
                lastName: user.Ulastname,
                email: user.Uemail,
                username: user.Ucredential
            }
        });
    }
    catch (error) {
        res.status(500).json({
            msg: 'Error al actualizar el perfil del usuario',
            error
        });
    }
});
exports.updateProfile = updateProfile;
