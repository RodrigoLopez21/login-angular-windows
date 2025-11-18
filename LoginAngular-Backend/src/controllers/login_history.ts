import { Request, Response } from 'express';
import { LoginHistory } from '../models/login_history';
import { User } from '../models/user';

export const createLoginHistory = async (req: Request, res: Response) => {
    try {
        const { Uid } = req.body;
        const history = await LoginHistory.create({
            Uid: Uid,
            Lhlogin_time: new Date()
        });
        res.json({ msg: 'Login registrado', data: history });
    } catch (error) {
        console.error('createLoginHistory error:', error);
        res.status(500).json({ msg: 'Error al registrar login', error });
    }
};

export const getLoginHistoryByUser = async (req: Request, res: Response) => {
    try {
        const { Uid } = req.params;
        const history = await LoginHistory.findAll({
            where: { Uid: Uid },
            order: [['Lhlogin_time', 'DESC']]
        });
        res.json({ msg: 'Historial obtenido', data: history });
    } catch (error) {
        console.error('getLoginHistoryByUser error:', error);
        res.status(500).json({ msg: 'Error al obtener historial', error });
    }
};

export const getLoginHistoryAll = async (req: Request, res: Response) => {
    try {
        const history = await LoginHistory.findAll({
            include: [{ model: User, as: 'user' }],
            order: [['Lhlogin_time', 'DESC']]
        });
        res.json({ msg: 'Historial completo obtenido', data: history });
    } catch (error) {
        console.error('getLoginHistoryAll error:', error);
        res.status(500).json({ msg: 'Error al obtener historial completo', error });
    }
};

export const updateLogoutTime = async (req: Request, res: Response) => {
    try {
        const { Lhid } = req.params;
        await LoginHistory.update(
            { Lhlogout_time: new Date() },
            { where: { Lhid: Lhid } }
        );
        res.json({ msg: 'Logout registrado' });
    } catch (error) {
        console.error('updateLogoutTime error:', error);
        res.status(500).json({ msg: 'Error al registrar logout', error });
    }
};
