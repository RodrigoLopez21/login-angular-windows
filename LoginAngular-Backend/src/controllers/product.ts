import { Request, Response } from 'express'
import { Product } from '../models/product';
import { Category } from '../models/category';



export const ReadProduct = async (req: Request, res: Response) => {
    const listProduct = await Product.findAll();
    res.json(
        listProduct
    );
}

export const ReadIdProductId = async (req: Request, res: Response) => {
    const { Pid } = req.params;
    try {
        const product = await Product.findOne({ where: { Pid: Pid } });

        if (!product) {
            return res.status(404).json({
                msg: `Product con ID ${Pid} no encontrada`
            });
        }
        return res.json({
            msg: `Product con ID ${Pid} encontrada exitosamente`,
            data: product
        });

    } catch (error) {
        return res.status(500).json({
            msg: `Error al buscar la Product con ID ${Pid}`
        });
    }
}

export const CreateProduct = async (req: Request, res: Response) => {

    const { Pname, Pdescription, CategoryId } = req.body

    try {

        const existingProduct = await Product.findOne({ where: { Pname: Pname } });

        if (existingProduct) {
            return res.status(400).json({
                msg: `Producto ${Pname}, ya existe`
            })
        }

        Product.create({
            Pname: Pname,
            Pdescription: Pdescription,
            Pstatus: 1,
            CategoryId: CategoryId
        })
        
        return res.json({
            msg: `Producto ${Pname}, creada exitosamente`
        })

    } catch (error) {
        return res.json({
            msg: `Error al crear la product ${Pname}`
        })
    }

}

export const UpdateProduct = async (req: Request, res: Response) => {

    const { Pid } = req.params;
    const { Pname, Pdescription, Pstatus, CategoryId } = req.body;
    
    try {
        const product: any = await Product.findOne({ where: { Pid: Pid } });
        
        if (!product) {
            return res.status(404).json({
                msg: `Producto ${Pname} no encontrada`
            });
        }
        console.log("Estoy por aqui ****** =>" + product.Pid);
        console.log("Estoy por aqui ****** =>" + Pname);

        await Product.update(
            {
                Pname: Pname,
                Pdescription: Pdescription,
                Pstatus: 1,
                CategoryId:CategoryId
            },
            { where: { Pid: Pid } }
        );

        console.log("Estoy por aqui ******");
        

        return res.json({
            msg: `Producto ${Pname} actualizada exitosamente`
        });

    } catch (error) {
        return res.status(500).json({
            msg: `Error al actualizar la Producto ${Pname}`
        });
    }
};

export const DeleteProduct = async (req: Request, res: Response) => {

    const { Pid } = req.params;
    try {
        const product: any = await Product.findOne({ where: { Pid: Pid } });

        if (!product) {
            return res.status(404).json({
                msg: `Producto con ID ${Pid} no encontrada`
            });
        }

        await Product.destroy({ where: { Pid: Pid } });

        return res.json({
            msg: `Producto con ID ${Pid} eliminada exitosamente`
        });

    } catch (error) {
        return res.status(500).json({
            msg: `Error al eliminar la Producto con ID ${Pid}`
        });
    }
};

