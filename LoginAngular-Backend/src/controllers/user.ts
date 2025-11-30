import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import { User } from '../models/user'
import { Op } from 'sequelize'
import jwt from 'jsonwebtoken'
import xss from 'xss';
import axios from 'axios';

interface UserInstance {
    Uid: number;
    Uname: string;
    Ulastname: string;
    Uemail: string;
    Upassword: string;
    Ucredential: string;
    Ustatus: number;
    update: (data: any) => Promise<any>;
    reload: () => Promise<any>;
}

// Simple in-memory store for verification codes
type VerificationEntry = {
    code: string;
    newValue?: string;
    expiresAt: number;
};

const verificationStore: Map<string, VerificationEntry> = new Map();

async function verifyRecaptcha(token: string): Promise<boolean> {
    try {
        const secretKey = process.env.RECAPTCHA_SECRET_KEY || '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe';
        const response = await axios.post(
            `https://www.google.com/recaptcha/api/siteverify`,
            null,
            {
                params: {
                    secret: secretKey,
                    response: token
                }
            }
        );
        return response.data.success === true;
    } catch (error) {
        console.error('Error verifying reCAPTCHA:', error);
        return false;
    }
}

async function sendVerificationEmail(to: string, code: string, type: string, uid?: number) {
    // Try to use nodemailer if available and SMTP env configured, otherwise fallback to console.log
    try {
        // Dynamic require so the project doesn't fail if nodemailer isn't installed
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const nodemailer = require('nodemailer');
        const host = process.env.SMTP_HOST;
        const port = process.env.SMTP_PORT;
        const user = process.env.SMTP_USER;
        const pass = process.env.SMTP_PASS;

        console.log('sendVerificationEmail - SMTP config:', { host, port, user: user ? '***' : 'NOT SET', pass: pass ? '***' : 'NOT SET' });

        if (host && user && pass) {
            const transporter = nodemailer.createTransport({
                host,
                port: port ? Number(port) : 587,
                secure: false,
                auth: { user, pass }
            });

            let subject = `Código de verificación (${type})`;
            let text = `Tu código de verificación es: ${code}`;

            // Customize for invitation type
            if (type.includes('invitation')) {
                subject = 'Invitación para establecer contraseña';
                const base = process.env.FRONTEND_URL || 'http://localhost:4200';
                const link = uid ? `${base}/set-password-invite?uid=${uid}&code=${code}` : `${base}/set-password-invite`;
                text = `Has sido invitado a la plataforma.\n\nTu código de invitación es: ${code}\n\n` +
                       `Por favor visita: ${link}\n` +
                       `E ingresa el código de invitación para establecer tu contraseña.`;
            }

            console.log('sendVerificationEmail - Sending email:', { to, subject, code });

            const info = await transporter.sendMail({
                from: process.env.SMTP_FROM || user,
                to,
                subject,
                text
            });
            console.log('✅ Verification email sent successfully:', info.messageId);
            return;
        } else {
            console.warn('⚠️ SMTP not fully configured. Required env vars: SMTP_HOST, SMTP_USER, SMTP_PASS');
        }
    } catch (e: any) {
        console.error('❌ Error sending verification email:', e.message || e);
    }

    // Fallback: print to server console for development/testing
    if (type.includes('invitation')) {
        const base = process.env.FRONTEND_URL || 'http://localhost:4200';
        const link = uid ? `${base}/set-password-invite?uid=${uid}&code=${code}` : `${base}/set-password-invite`;
        console.log(`\n========== INVITATION EMAIL ==========`);
        console.log(`To: ${to}`);
        console.log(`Invitation Code: ${code}`);
        console.log(`Link: ${link}`);
        console.log(`========================================\n`);
    } else {
        console.log(`Verification code for ${to} (type=${type}): ${code}`);
    }
}


export const ReadUser = async (req: Request, res: Response) => {
    // Return users together with their role (Rid) from user_has_roles
    try {
        const listUser = await User.findAll({ raw: true }) as any[];
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { UserHasRoles } = require('../models/user_has_roles');
        const mappings = await UserHasRoles.findAll({ raw: true }) as any[];
        const mapByUid: Record<number, number> = {};
        mappings.forEach(m => { mapByUid[m.Uid] = m.Rid; });

        const data = listUser.map(u => ({ ...u, Rid: mapByUid[u.Uid] ?? 2 }));

        res.json({ msg: `Lista de usuarios obtenida`, data });
    } catch (error) {
        console.error('ReadUser error:', error);
        res.status(500).json({ msg: 'Error al listar usuarios', error });
    }
}



export const CreateUser = async (req: Request, res: Response) => {
    // Sanitiza los datos recibidos
    const Uname = xss(req.body.Uname);
    const Ulastname = xss(req.body.Ulastname);
    const Upassword = xss(req.body.Upassword);
    const Uemail = xss(req.body.Uemail);
    const Ucredential = xss(req.body.Ucredential);

    const userEmail = await User.findOne({ where: {  Uemail: Uemail  }})
    const userCredential = await User.findOne({ where: {  Ucredential: Ucredential  }})

    if (userEmail) {
        return res.status(400).json({
            msg: `Usuario ya existe con el email ${Uemail}`
        })
    }

    if (userCredential) {
        return res.status(400).json({
            msg: `Usuario ya existe con la credencial ${Ucredential}`
        })
    }

    const UpasswordHash = await bcrypt.hash(Upassword, 10)
    try {
        User.create({
            Uname: Uname,
            Ulastname: Ulastname,
            Uemail: Uemail,
            Upassword: UpasswordHash,
            Ucredential: Ucredential,
            Ustatus: 1
        })

        res.json({
            msg: `User ${Uname} ${Ulastname} create success.`
        })

    } catch (error) {
        res.status(400).json({
            msg: `Existe un error al crear el usuario => `, error
        })
    }
}

export const LoginUser = async (req: Request, res: Response) => {
    const { Uemail, Upassword, recaptchaToken } = req.body;

    // Verificar reCAPTCHA
    if (!recaptchaToken) {
        return res.status(400).json({
            msg: 'reCAPTCHA es requerido'
        });
    }

    const isRecaptchaValid = await verifyRecaptcha(recaptchaToken);
    if (!isRecaptchaValid) {
        return res.status(400).json({
            msg: 'Verificación de reCAPTCHA fallida. Por favor, intenta de nuevo.'
        });
    }

    const user: any = await User.findOne({ where: { Uemail: Uemail } })
    if (!user) {
        return res.status(400).json({
            msg: `Usuario no existe con el email ${Uemail}`
        })
    }

    // Block login for inactive users
    if (user.Ustatus !== 1) {
        return res.status(403).json({ msg: 'Usuario inactivo. Contacte al administrador.' });
    }

    const passwordValid = await bcrypt.compare(Upassword, user.Upassword)

    if (!passwordValid) {
        return res.status(400).json({
            msg: `Password Incorrecto => ${Upassword}`
        })
    }

    // Instead of issuing a token, start 2FA
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
    const key = `${user.Uid}:login`;
    verificationStore.set(key, { code, expiresAt });

    await sendVerificationEmail(user.Uemail, code, 'login');

    res.json({
        msg: 'Verification required',
        twoFactorRequired: true,
        email: user.Uemail
    });
}

export const LoginVerify = async (req: Request, res: Response) => {
    const { email, code } = req.body;

    const user: any = await User.findOne({ where: { Uemail: email } });
    if (!user) {
        return res.status(400).json({ msg: `Usuario no existe con el email ${email}` });
    }

    // Prevent token issuance for inactive users
    if (user.Ustatus !== 1) {
        return res.status(403).json({ msg: 'Usuario inactivo. Contacte al administrador.' });
    }

    const key = `${user.Uid}:login`;
    const entry = verificationStore.get(key);

    if (!entry) return res.status(400).json({ msg: 'Código no encontrado o expirado' });
    if (entry.expiresAt < Date.now()) {
        verificationStore.delete(key);
        return res.status(400).json({ msg: 'Código expirado' });
    }
    if (entry.code !== String(code)) return res.status(400).json({ msg: 'Código inválido' });

    verificationStore.delete(key); // Code is single-use

    // Obtener el Rid del usuario desde user_has_roles
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { UserHasRoles } = require('../models/user_has_roles');
    const userRole: any = await UserHasRoles.findOne({ where: { Uid: user.Uid } });
    const rid = userRole ? userRole.Rid : 2; // Default to 2 (User)

    // Record login history and capture id so frontend can later mark logout
    let loginHistoryId: number | null = null;
    try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { LoginHistory } = require('../models/login_history');
        const history: any = await LoginHistory.create({
            Uid: user.Uid,
            Lhlogin_time: new Date()
        });
        if (history && history.Lhid) loginHistoryId = history.Lhid;
    } catch (error) {
        console.error('Error recording login history:', error);
        // Don't fail login if history recording fails
    }

    const secretKey = process.env.SECRET_KEY;
    if (!secretKey) {
        console.error('Error Crítico: La variable de entorno SECRET_KEY no está definida.');
        return res.status(500).json({ msg: 'Error interno del servidor: la configuración de seguridad está incompleta.' });
    }
    const token = jwt.sign({
        id: user.Uid,
        email: user.Uemail,
        rid: rid,
        rol: user.Ucredential
    }, secretKey);
    // Return token and loginHistoryId (if available) so frontend can record logout
    res.json({ token, loginHistoryId });
}

export const getProfile = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id; // Obtiene el ID del usuario del token
        const user = await User.findByPk(userId) as any as UserInstance;
        
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
    } catch (error) {
        res.status(500).json({
            msg: 'Error al obtener el perfil del usuario',
            error
        });
    }
}

export const getUserRole = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        // Import the model dynamically to avoid circular issues
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { UserHasRoles } = require('../models/user_has_roles');

        const mapping: any = await UserHasRoles.findOne({ where: { Uid: userId } });
        if (!mapping) {
            return res.status(404).json({ msg: 'Rol del usuario no encontrado' });
        }

        return res.json({ Rid: mapping.Rid });
    } catch (error) {
        console.error('getUserRole error:', error);
        return res.status(500).json({ msg: 'Error al obtener el rol del usuario', error });
    }
}

export const updateUserRole = async (req: Request, res: Response) => {
    try {
        // Only admins can change roles
        const requester: any = (req as any).user;
        if (!requester || requester.rid !== 1) {
            return res.status(403).json({ msg: 'Permisos insuficientes' });
        }

        const userId = Number(req.params.Uid);
        const { Rid } = req.body;
        const newRid = Number(Rid);
        if (![1, 2].includes(newRid)) {
            return res.status(400).json({ msg: 'Rid inválido. Debe ser 1 (admin) o 2 (user).' });
        }

        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { UserHasRoles } = require('../models/user_has_roles');

        const mapping: any = await UserHasRoles.findOne({ where: { Uid: userId } });
        if (!mapping) {
            // create mapping
            await UserHasRoles.create({ Uid: userId, Rid: newRid });
        } else {
            await UserHasRoles.update({ Rid: newRid }, { where: { Uid: userId } });
        }

        return res.json({ msg: 'Rol actualizado correctamente', Rid: newRid });
    } catch (error) {
        console.error('updateUserRole error:', error);
        return res.status(500).json({ msg: 'Error al actualizar el rol', error });
    }
}

export const updateProfile = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const { firstName, lastName, email, password } = req.body;

        const user = await User.findByPk(userId) as any as UserInstance;
        if (!user) {
            return res.status(404).json({
                msg: 'Usuario no encontrado'
            });
        }

        // Actualizar solo los campos que se proporcionan (no undefined)
        const updateData: any = {};
        
        if (firstName !== undefined && firstName !== null) {
            updateData.Uname = xss(firstName);
        }
        if (lastName !== undefined && lastName !== null) {
            updateData.Ulastname = xss(lastName);
        }
        if (email !== undefined && email !== null) {
            updateData.Uemail = xss(email);
        }

        // Si se proporciona una nueva contraseña, hashearla
        if (password) {
            updateData.Upassword = await bcrypt.hash(xss(password), 10);
        }

        // Solo actualizar si hay campos para actualizar
        if (Object.keys(updateData).length > 0) {
            await user.update(updateData);
            await user.reload();
        }

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
    } catch (error) {
        res.status(500).json({
            msg: 'Error al actualizar el perfil del usuario',
            error
        });
    }
}

export const requestVerification = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const { type, newValue } = req.body as { type: string; newValue?: string };

        const user = await User.findByPk(userId) as any as UserInstance;
        if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });

        // Generate 6-digit code
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
        const key = `${userId}:${type}`;
        verificationStore.set(key, { code, newValue, expiresAt });

        // Send code to user's current email (safer) - if changing email this ensures identity
        const toEmail = user.Uemail;
        await sendVerificationEmail(toEmail, code, type);

        res.json({ msg: 'Código de verificación enviado' });
    } catch (error) {
        console.error('requestVerification error:', error);
        res.status(500).json({ msg: 'Error al solicitar verificación', error });
    }
}

export const confirmVerification = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const { type, code, newValue, newPassword } = req.body as any;
        const key = `${userId}:${type}`;
        const entry = verificationStore.get(key);
        if (!entry) return res.status(400).json({ msg: 'Código no encontrado o expirado' });
        if (entry.expiresAt < Date.now()) {
            verificationStore.delete(key);
            return res.status(400).json({ msg: 'Código expirado' });
        }
        if (entry.code !== String(code)) return res.status(400).json({ msg: 'Código inválido' });

        const user = await User.findByPk(userId) as any as UserInstance;
        if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });

        // Apply the requested change
        const updateData: any = {};
        if (type === 'email') {
            updateData.Uemail = xss(newValue ?? entry.newValue);
        } else if (type === 'password') {
            const pw = newPassword ?? entry.newValue;
            if (!pw) return res.status(400).json({ msg: 'Nueva contraseña requerida' });
            updateData.Upassword = await bcrypt.hash(xss(pw), 10);
        } else if (type === 'phone') {
            updateData.Uphone = xss(newValue ?? entry.newValue);
        }

        await user.update(updateData);
        await user.reload();
        verificationStore.delete(key);

        res.json({ 
            msg: 'Verificación exitosa y dato actualizado',
            user: {
                id: user.Uid,
                firstName: user.Uname,
                lastName: user.Ulastname,
                email: user.Uemail,
                username: user.Ucredential
            }
        });
    } catch (error) {
        console.error('confirmVerification error:', error);
        res.status(500).json({ msg: 'Error al confirmar verificación', error });
    }
}

export const updateUserStatus = async (req: Request, res: Response) => {
    try {
        const { Uid } = req.params;
        const { Ustatus } = req.body;

        if (Ustatus !== 0 && Ustatus !== 1) {
            return res.status(400).json({ msg: 'Status debe ser 0 (inactivo) o 1 (activo)' });
        }

        const user = await User.findByPk(Uid) as any as UserInstance;
        if (!user) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        await user.update({ Ustatus: Ustatus });
        await user.reload();

        res.json({ 
            msg: 'Estado del usuario actualizado',
            user: {
                Uid: user.Uid,
                Uname: user.Uname,
                Ustatus: user.Ustatus
            }
        });
    } catch (error) {
        console.error('updateUserStatus error:', error);
        res.status(500).json({ msg: 'Error al actualizar estado del usuario', error });
    }
}

export const inviteUser = async (req: Request, res: Response) => {
    try {
        // Only admins can invite users
        const requester: any = (req as any).user;
        if (!requester || requester.rid !== 1) {
            return res.status(403).json({ msg: 'Permisos insuficientes' });
        }

        const Uname = xss(req.body.Uname || '');
        const Ulastname = xss(req.body.Ulastname || '');
        const Uemail = xss(req.body.Uemail);
        const Ucredential = xss(req.body.Ucredential || Uemail); // fallback: use email as credential
        const Rid = Number(req.body.Rid) || 2; // default to User role

        if (!Uname || !Ulastname || !Uemail || !Ucredential) {
            return res.status(400).json({ msg: 'Faltan campos requeridos (Uname, Ulastname, Uemail, Ucredential)' });
        }

        const userEmail = await User.findOne({ where: { Uemail } });
        const userCredential = await User.findOne({ where: { Ucredential } });

        if (userEmail) {
            return res.status(400).json({ msg: `Usuario ya existe con el email ${Uemail}` });
        }
        if (userCredential) {
            return res.status(400).json({ msg: `Usuario ya existe con la credencial ${Ucredential}` });
        }

        // Generate temporary password (placeholder, will be replaced by user)
        const tempPassword = 'TEMP_' + Math.random().toString(36).substring(2, 15);
        const UpasswordHash = await bcrypt.hash(tempPassword, 10);

        // Create user with placeholder password, status = 1 (active)
        const newUser: any = await User.create({
            Uname,
            Ulastname,
            Uemail,
            Upassword: UpasswordHash,
            Ucredential,
            Ustatus: 1
        });

        // Create role mapping in user_has_roles
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { UserHasRoles } = require('../models/user_has_roles');
        await UserHasRoles.create({ Uid: newUser.Uid, Rid });

        // Generate invitation code
        const inviteCode = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
        const key = `invite:${newUser.Uid}`;
        verificationStore.set(key, { code: inviteCode, expiresAt });

        // Send invitation email with code and uid in link
        await sendVerificationEmail(
            Uemail,
            inviteCode,
            `invitation (user: ${Ucredential})`,
            newUser.Uid
        );

        res.json({
            msg: 'Usuario invitado exitosamente. Se envió un correo de invitación.',
            user: {
                Uid: newUser.Uid,
                Uname: newUser.Uname,
                Uemail: newUser.Uemail
            }
        });
    } catch (error) {
        console.error('inviteUser error:', error);
        res.status(500).json({ msg: 'Error al invitar usuario', error });
    }
}

export const setPasswordFromInvite = async (req: Request, res: Response) => {
    try {
        const { Uid, inviteCode, newPassword } = req.body;

        if (!Uid || !inviteCode || !newPassword) {
            return res.status(400).json({ msg: 'Faltan campos requeridos (Uid, inviteCode, newPassword)' });
        }

        const user = await User.findByPk(Uid) as any as UserInstance;
        if (!user) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        const key = `invite:${Uid}`;
        const entry = verificationStore.get(key);

        if (!entry) {
            return res.status(400).json({ msg: 'Código de invitación no encontrado o expirado' });
        }
        if (entry.expiresAt < Date.now()) {
            verificationStore.delete(key);
            return res.status(400).json({ msg: 'Código de invitación expirado' });
        }
        if (entry.code !== String(inviteCode)) {
            return res.status(400).json({ msg: 'Código de invitación inválido' });
        }

        // Hash new password and update user
        const UpasswordHash = await bcrypt.hash(xss(newPassword), 10);
        await user.update({ Upassword: UpasswordHash });
        await user.reload();

        verificationStore.delete(key); // Code is single-use

        res.json({
            msg: 'Contraseña establecida correctamente. Puedes iniciar sesión.',
            user: {
                Uid: user.Uid,
                Uname: user.Uname,
                Uemail: user.Uemail
            }
        });
    } catch (error) {
        console.error('setPasswordFromInvite error:', error);
        res.status(500).json({ msg: 'Error al establecer contraseña', error });
    }
}
