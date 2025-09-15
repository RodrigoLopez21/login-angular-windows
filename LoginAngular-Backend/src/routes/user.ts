import { Router } from "express";
import { CreateUser, LoginUser, ReadUser } from "../controllers/user";

const router = Router();

router.get("/api/user/read", ReadUser)
router.post("/api/user/create", CreateUser)
router.post("/api/user/register", CreateUser)
router.post("/api/user/login", LoginUser)


export default router
