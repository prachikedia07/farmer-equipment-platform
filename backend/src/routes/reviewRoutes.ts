import express from "express";
import { addReview, getReviewsByEquipment, deleteReview } from "../controllers/reviewController";
import { protect } from "../middleware/middleware";

const router = express.Router();

router.post("/", protect, addReview);
router.get("/:id", getReviewsByEquipment);
router.delete("/:id", protect, deleteReview);

export default router;