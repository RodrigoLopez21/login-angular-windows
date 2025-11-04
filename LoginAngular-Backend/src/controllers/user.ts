import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import { User } from '../models/user'
import { Op } from 'sequelize'
import jwt from 'jsonwebtoken'
import xss from 'xss';


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

    // Incluye id, email y rol en el token
    const secretKey = process.env.SECRET_KEY;
    if (!secretKey) {
        console.error('Error Crítico: La variable de entorno SECRET_KEY no está definida.');
        return res.status(500).json({ msg: 'Error interno del servidor: la configuración de seguridad está incompleta.' });
    }
    const token = jwt.sign({
    id: user.Uid,
    email: user.Uemail,
    rol: user.Ucredential 
    }, secretKey);
    res.json({ token });
}