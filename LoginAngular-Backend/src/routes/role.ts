import { Router } from "express";
import { CreateRole, DeleteRole, ReadRole, ReadRoleId, UpdateRole } from "../controllers/role";

const router = Router();

router.get("/api/role/read", ReadRole)
router.get("/api/role/read/:Rid", ReadRoleId)
router.post("/api/role/create", CreateRole)
router.patch("/api/role/update/:Rid", UpdateRole)
router.delete("/api/role/delete/:Rid", DeleteRole)

export default router
