import { Router } from "express";
import { CreateUser, LoginUser, LoginVerify, ReadUser, getProfile, updateProfile, requestVerification, confirmVerification, getUserRole, updateUserStatus, updateUserRole } from "../controllers/user";
import validateToken from './validateToken';

const router = Router();

router.get("/api/user/read", ReadUser)
router.post("/api/user/create", CreateUser)
router.post("/api/user/register", CreateUser)
router.post("/api/user/login", LoginUser)
router.post("/api/user/login/verify", LoginVerify)
router.get("/api/user/profile", validateToken, getProfile)
router.put("/api/user/profile", validateToken, updateProfile)
router.post('/api/user/verify-request', validateToken, requestVerification)
router.post('/api/user/verify-confirm', validateToken, confirmVerification)
router.get('/api/user/role', validateToken, getUserRole)
router.put('/api/user/status/:Uid', validateToken, updateUserStatus)
router.put('/api/user/role/:Uid', validateToken, updateUserRole)

export default router
