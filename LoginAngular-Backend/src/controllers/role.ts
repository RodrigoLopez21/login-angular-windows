import { Request, Response } from 'express'
import { Role } from '../models/role';

export const ReadRole = async (req: Request, res: Response) => {
    const listRole = await Role.findAll();
    res.json(listRole);
}


export const ReadRoleId = async (req: Request, res: Response) => {
    const { Rid } = req.params;
    try {
        const role = await Role.findOne({ where: { Rid: Rid } });

        if (!role) {
            return res.status(404).json({
                msg: `Rol con ID ${Rid} no encontrada`
            });
        }    
        return res.json({
            msg: `Rol con ID ${Rid} encontrada exitosamente`,
            data: role
        });
        
    } catch (error) {
        return res.status(500).json({
            msg: `Error al buscar la Rol con ID ${Rid}`
        });
    }
}

export const CreateRole = async (req: Request, res: Response) => {

    const { Rname } = req.body

    const role: any = await Role.findOne({ where: { Rname: Rname } })

    if (role) {
        return res.status(400).json({
            msg: `Rol ${Rname}, ya existe`
        })
    }
    try {
        Role.create({
            Rname: Rname,
            Rstatus: 1
        })
        return res.json({
            msg: `Rol ${Rname}, creada exitosamente`
        })
    } catch (error) {
        return res.json({
            msg: `Error al crear la Rol ${Rname}`
        })
    }

}

export const UpdateRole = async (req: Request, res: Response) => {

    const { Rid } = req.params;
    const { Rname, Rstatus } = req.body;

    try {
        const role: any = await Role.findOne({ where: { Rid: Rid } });

        if (!role) {
            return res.status(404).json({
                msg: `Rol ${Rname} no encontrada`
            });
        }

        await Role.update(
            {
                Rname: Rname,
                Rstatus: Rstatus
            },
            { where: { Rid: Rid } }
        );

        return res.json({
            msg: `Rol ${Rname} actualizada exitosamente`
        });

    } catch (error) {
        return res.status(500).json({
            msg: `Error al actualizar la Rol ${Rname}`
        });
    }
};

export const DeleteRole = async (req: Request, res: Response) => {

    const { Rid } = req.params;
    try {
        const role: any = await Role.findOne({ where: { Rid: Rid } });

        if (!role) {
            return res.status(404).json({
                msg: `Rol con ID ${Rid} no encontrada`
            });
        }

        await Role.destroy({ where: { Rid: Rid } });

        return res.json({
            msg: `Rol con ID ${Rid} eliminada exitosamente`
        });

    } catch (error) {
        return res.status(500).json({
            msg: `Error al eliminar la Rol con ID ${Rid}`
        });
    }
};

