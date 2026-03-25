import express from "express";
import { registerUser, loginUser, getMe, getProfile, updateProfile } from "../controllers/authController";
import { protect } from "../middleware/middleware";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);
router.get("/profile", protect, getProfile);
router.patch("/profile", protect, updateProfile);

export default router;