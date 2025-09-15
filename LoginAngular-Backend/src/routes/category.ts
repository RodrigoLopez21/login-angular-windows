import { Router } from "express";
import { CreateCategory, DeleteCategory, ReadCategory, ReadCategoryId, UpdateCategory } from "../controllers/category";

const router = Router();

router.get("/api/category/read", ReadCategory)
router.get("/api/category/read/:Cid", ReadCategoryId)
router.post("/api/category/create", CreateCategory)
router.patch("/api/category/update/:Cid", UpdateCategory)
router.delete("/api/category/delete/:Cid", DeleteCategory)

export default router