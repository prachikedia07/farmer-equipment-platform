import express from "express";
import { addReview, getReviewsByEquipment } from "../controllers/reviewController";
import { protect } from "../middleware/middleware";

const router = express.Router();

router.post("/", protect, addReview);
router.get("/:id", getReviewsByEquipment);

export default router;