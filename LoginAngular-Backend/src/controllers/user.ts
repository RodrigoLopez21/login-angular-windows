import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import { User } from '../models/user'
import { Op } from 'sequelize'
import jwt from 'jsonwebtoken'
import xss from 'xss';

interface UserInstance {
    Uid: number;
    Uname: string;
    Ulastname: string;
    Uemail: string;
    Upassword: string;
    Ucredential: string;
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

async function sendVerificationEmail(to: string, code: string, type: string) {
    // Try to use nodemailer if available and SMTP env configured, otherwise fallback to console.log
    try {
        // Dynamic require so the project doesn't fail if nodemailer isn't installed
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const nodemailer = require('nodemailer');
        const host = process.env.SMTP_HOST;
        const port = process.env.SMTP_PORT;
        const user = process.env.SMTP_USER;
        const pass = process.env.SMTP_PASS;

        if (host && user && pass) {
            const transporter = nodemailer.createTransport({
                host,
                port: port ? Number(port) : 587,
                secure: false,
                auth: { user, pass }
            });

            const info = await transporter.sendMail({
                from: process.env.SMTP_FROM || user,
                to,
                subject: `Código de verificación (${type})`,
                text: `Tu código de verificación es: ${code}`
            });
            console.log('Verification email sent:', info.messageId);
            return;
        }
    } catch (e) {
        // nodemailer not configured/installed - ignore and fallback to console
    }

    // Fallback: print to server console for development/testing
    console.log(`Verification code for ${to} (type=${type}): ${code}`);
}


export const ReadUser = async (req: Request, res: Response) => {
    const listUser = await User.findAll();
    res.json({
        msg: `List de categoría encontrada exitosamente`,
        data: listUser
    });
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
    const { Uemail, Upassword } = req.body;

    const user: any = await User.findOne({ where: { Uemail: Uemail } })
    if (!user) {
        return res.status(400).json({
            msg: `Usuario no existe con el email ${Uemail}`
        })
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
    res.json({ token });
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
