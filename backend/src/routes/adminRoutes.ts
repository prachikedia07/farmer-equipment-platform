import express from "express";
import { getAdminDashboard } from "../controllers/adminController";
import { protect } from "../middleware/middleware";
import { adminOnly } from "../middleware/adminMiddleware";

const router = express.Router();

router.get("/dashboard", protect, adminOnly, getAdminDashboard);

export default router;