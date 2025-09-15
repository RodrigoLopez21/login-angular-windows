import { Router } from "express";
import { CreateProduct, DeleteProduct, ReadIdProductId, ReadProduct, UpdateProduct } from "../controllers/product";
import validateToken from "./validateToken";

const router = Router();

router.get("/api/product/read", validateToken, ReadProduct)
router.get("/api/product/read/:Pid", ReadIdProductId)
router.post("/api/product/create", CreateProduct)
router.patch("/api/product/update/:Pid", UpdateProduct)
router.delete("/api/product/delete/:Pid", DeleteProduct)

export default router