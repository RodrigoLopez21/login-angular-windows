import { Router } from "express";
import { CreateProduct, DeleteProduct, ReadProduct, UpdateProduct } from "../controllers/product";
import validateToken from "../routes/validateToken";

const router = Router();

// Rutas Públicas (Cualquiera puede ver los productos)
router.get("/api/product/read", ReadProduct);

// Rutas Protegidas (Solo usuarios con token válido pueden modificar)
router.post("/api/product/create", validateToken, CreateProduct);
router.patch("/api/product/update/:Pid", validateToken, UpdateProduct);
router.delete("/api/product/delete/:Pid", validateToken, DeleteProduct);

export default router