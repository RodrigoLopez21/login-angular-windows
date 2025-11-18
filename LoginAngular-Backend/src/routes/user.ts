import { Router } from "express";
import { CreateUser, LoginUser, LoginVerify, ReadUser, getProfile, updateProfile, requestVerification, confirmVerification, getUserRole, updateUserStatus, updateUserRole, inviteUser, setPasswordFromInvite } from "../controllers/user";
import validateToken from './validateToken';

const router = Router();

// Test SMTP endpoint
router.post("/api/user/test-smtp", async (req, res) => {
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
        await transporter.verify();
        console.log('✅ SMTP connection verified successfully');

        // Send a test email
        const info = await transporter.sendMail({
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
    } catch (error: any) {
        console.error('❌ SMTP Test Error:', error.message || error);
        res.status(500).json({
            msg: 'Error testing SMTP',
            error: error.message || error.toString()
        });
    }
});

router.get("/api/user/read", ReadUser)
router.post("/api/user/create", CreateUser)
router.post("/api/user/register", CreateUser)
router.post("/api/user/login", LoginUser)
router.post("/api/user/login/verify", LoginVerify)
router.get("/api/user/profile", validateToken, getProfile)
router.put("/api/user/profile", validateToken, updateProfile)
router.post('/api/user/verify-request', validateToken, requestVerification)
router.post('/api/user/verify-confirm', validateToken, confirmVerification)
router.get('/api/user/role', validateToken, getUserRole)
router.put('/api/user/status/:Uid', validateToken, updateUserStatus)
router.put('/api/user/role/:Uid', validateToken, updateUserRole)
router.post('/api/user/invite', validateToken, inviteUser)
router.post('/api/user/set-password-from-invite', setPasswordFromInvite)

export default router
