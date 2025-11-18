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
const express_1 = require("express");
const user_1 = require("../controllers/user");
const validateToken_1 = __importDefault(require("./validateToken"));
const router = (0, express_1.Router)();
// Test SMTP endpoint
router.post("/api/user/test-smtp", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const nodemailer = require('nodemailer');
        const host = process.env.SMTP_HOST;
        const port = process.env.SMTP_PORT;
        const user = process.env.SMTP_USER;
        const pass = process.env.SMTP_PASS;
        console.log('Test SMTP - Config:', { host, port, user, pass: pass ? '***' : 'NOT SET' });
        if (!host || !user || !pass) {
            return res.status(400).json({ msg: 'SMTP no está configurado. Falta: ' + (!host ? 'SMTP_HOST ' : '') + (!user ? 'SMTP_USER ' : '') + (!pass ? 'SMTP_PASS' : '') });
        }
        const transporter = nodemailer.createTransport({
            host,
            port: port ? Number(port) : 587,
            secure: false,
            auth: { user, pass }
        });
        console.log('Test SMTP - Attempting to verify connection...');
        yield transporter.verify();
        console.log('✅ SMTP connection verified successfully');
        // Send a test email
        const info = yield transporter.sendMail({
            from: process.env.SMTP_FROM || user,
            to: req.body.email || user, // default to SMTP_USER if no email provided
            subject: 'Test Email from LoginAngular',
            text: 'This is a test email to verify SMTP is working correctly.'
        });
        console.log('✅ Test email sent:', info.messageId);
        res.json({
            msg: 'SMTP working correctly',
            messageId: info.messageId,
            config: { host, port, user }
        });
    }
    catch (error) {
        console.error('❌ SMTP Test Error:', error.message || error);
        res.status(500).json({
            msg: 'Error testing SMTP',
            error: error.message || error.toString()
        });
    }
}));
router.get("/api/user/read", user_1.ReadUser);
router.post("/api/user/create", user_1.CreateUser);
router.post("/api/user/register", user_1.CreateUser);
router.post("/api/user/login", user_1.LoginUser);
router.post("/api/user/login/verify", user_1.LoginVerify);
router.get("/api/user/profile", validateToken_1.default, user_1.getProfile);
router.put("/api/user/profile", validateToken_1.default, user_1.updateProfile);
router.post('/api/user/verify-request', validateToken_1.default, user_1.requestVerification);
router.post('/api/user/verify-confirm', validateToken_1.default, user_1.confirmVerification);
router.get('/api/user/role', validateToken_1.default, user_1.getUserRole);
router.put('/api/user/status/:Uid', validateToken_1.default, user_1.updateUserStatus);
router.put('/api/user/role/:Uid', validateToken_1.default, user_1.updateUserRole);
router.post('/api/user/invite', validateToken_1.default, user_1.inviteUser);
router.post('/api/user/set-password-from-invite', user_1.setPasswordFromInvite);
exports.default = router;
