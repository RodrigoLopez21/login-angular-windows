import { Router } from "express";
import { createLoginHistory, getLoginHistoryByUser, getLoginHistoryAll, updateLogoutTime } from "../controllers/login_history";
import validateToken from './validateToken';

const router = Router();

router.post("/api/login-history/create", createLoginHistory);
router.get("/api/login-history/user/:Uid", getLoginHistoryByUser);
router.get("/api/login-history/all", validateToken, getLoginHistoryAll);
router.patch("/api/login-history/logout/:Lhid", updateLogoutTime);

export default router;
