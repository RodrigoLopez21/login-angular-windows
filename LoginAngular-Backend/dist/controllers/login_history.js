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
exports.updateLogoutTime = exports.getLoginHistoryAll = exports.getLoginHistoryByUser = exports.createLoginHistory = void 0;
const login_history_1 = require("../models/login_history");
const user_1 = require("../models/user");
const createLoginHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { Uid } = req.body;
        const history = yield login_history_1.LoginHistory.create({
            Uid: Uid,
            Lhlogin_time: new Date()
        });
        res.json({ msg: 'Login registrado', data: history });
    }
    catch (error) {
        console.error('createLoginHistory error:', error);
        res.status(500).json({ msg: 'Error al registrar login', error });
    }
});
exports.createLoginHistory = createLoginHistory;
const getLoginHistoryByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { Uid } = req.params;
        const history = yield login_history_1.LoginHistory.findAll({
            where: { Uid: Uid },
            order: [['Lhlogin_time', 'DESC']]
        });
        res.json({ msg: 'Historial obtenido', data: history });
    }
    catch (error) {
        console.error('getLoginHistoryByUser error:', error);
        res.status(500).json({ msg: 'Error al obtener historial', error });
    }
});
exports.getLoginHistoryByUser = getLoginHistoryByUser;
const getLoginHistoryAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const history = yield login_history_1.LoginHistory.findAll({
            include: [{ model: user_1.User, as: 'user' }],
            order: [['Lhlogin_time', 'DESC']]
        });
        res.json({ msg: 'Historial completo obtenido', data: history });
    }
    catch (error) {
        console.error('getLoginHistoryAll error:', error);
        res.status(500).json({ msg: 'Error al obtener historial completo', error });
    }
});
exports.getLoginHistoryAll = getLoginHistoryAll;
const updateLogoutTime = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { Lhid } = req.params;
        yield login_history_1.LoginHistory.update({ Lhlogout_time: new Date() }, { where: { Lhid: Lhid } });
        res.json({ msg: 'Logout registrado' });
    }
    catch (error) {
        console.error('updateLogoutTime error:', error);
        res.status(500).json({ msg: 'Error al registrar logout', error });
    }
});
exports.updateLogoutTime = updateLogoutTime;
