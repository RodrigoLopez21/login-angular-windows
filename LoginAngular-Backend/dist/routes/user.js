"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = require("../controllers/user");
const validateToken_1 = __importDefault(require("./validateToken"));
const router = (0, express_1.Router)();
router.get("/api/user/read", user_1.ReadUser);
router.post("/api/user/create", user_1.CreateUser);
router.post("/api/user/register", user_1.CreateUser);
router.post("/api/user/login", user_1.LoginUser);
router.get("/api/user/profile", validateToken_1.default, user_1.getProfile);
router.put("/api/user/profile", validateToken_1.default, user_1.updateProfile);
exports.default = router;
