import { Request, Response } from 'express'
import { Category } from '../models/category'

export const ReadCategory = async (req: Request, res: Response) => {
    const listCategory = await Category.findAll();
    res.json(listCategory);
    // res.json({
    //     msg: `List de categoría encontrada exitosamente`,
    //     data: listCategory
    // });
}

export const ReadCategoryId = async (req: Request, res: Response) => {
    const { Cid } = req.params;
    try {
        const category = await Category.findOne({ where: { Cid: Cid } });

        if (!category) {
            return res.status(404).json({
                msg: `Categoría con ID ${Cid} no encontrada`
            });
        }    
        return res.json({
            msg: `Categoría con ID ${Cid} encontrada exitosamente`,
            data: category
        });
        
    } catch (error) {
        return res.status(500).json({
            msg: `Error al buscar la categoría con ID ${Cid}`
        });
    }
}

export const CreateCategory = async (req: Request, res: Response) => {

    const { Cname, Cdescription } = req.body

    const category: any = await Category.findOne({ where: { Cname: Cname } })

    if (category) {
        return res.status(400).json({
            msg: `Categoria ${Cname}, ya existe`
        })
    }
    try {
        Category.create({
            Cname: Cname,
            Cdescription: Cdescription,
            Cstatus: 1
        })
        return res.json({
            msg: `Categoria ${Cname}, creada exitosamente`
        })
    } catch (error) {
        return res.json({
            msg: `Error al crear la categoria ${Cname}`
        })
    }

}


export const UpdateCategory = async (req: Request, res: Response) => {

    const { Cid } = req.params;
    const { Cname, Cdescription, Cstatus } = req.body;

    try {
        const category: any = await Category.findOne({ where: { Cid: Cid } });

        if (!category) {
            return res.status(404).json({
                msg: `Categoría ${Cname} no encontrada`
            });
        }

        await Category.update(
            {
                Cname: Cname,
                Cdescription: Cdescription,
                Cstatus: Cstatus
            },
            { where: { Cid: Cid } }
        );

        return res.json({
            msg: `Categoría ${Cname} actualizada exitosamente`
        });

    } catch (error) {
        return res.status(500).json({
            msg: `Error al actualizar la categoría ${Cname}`
        });
    }
};

export const DeleteCategory = async (req: Request, res: Response) => {

    const { Cid } = req.params;
    try {
        const category: any = await Category.findOne({ where: { Cid: Cid } });

        if (!category) {
            return res.status(404).json({
                msg: `Categoría con ID ${Cid} no encontrada`
            });
        }

        await Category.destroy({ where: { Cid: Cid } });

        return res.json({
            msg: `Categoría con ID ${Cid} eliminada exitosamente`
        });

    } catch (error) {
        return res.status(500).json({
            msg: `Error al eliminar la categoría con ID ${Cid}`
        });
    }
};

