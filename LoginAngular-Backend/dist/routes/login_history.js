"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const login_history_1 = require("../controllers/login_history");
const validateToken_1 = __importDefault(require("./validateToken"));
const router = (0, express_1.Router)();
router.post("/api/login-history/create", login_history_1.createLoginHistory);
router.get("/api/login-history/user/:Uid", login_history_1.getLoginHistoryByUser);
router.get("/api/login-history/all", validateToken_1.default, login_history_1.getLoginHistoryAll);
router.patch("/api/login-history/logout/:Lhid", login_history_1.updateLogoutTime);
exports.default = router;
