import express from "express";
import { createBooking,
  getMyBookings,
  getOwnerBookings,
  updateBookingStatus, 
markBookingCompleted, cancelBookingByFarmer } from "../controllers/bookingController";
import { protect } from "../middleware/middleware";

const router = express.Router();

router.post("/", protect, createBooking);
router.get("/my", protect, getMyBookings);
router.get("/owner", protect, getOwnerBookings);

router.patch("/:id", protect, updateBookingStatus);
router.patch("/:id/complete", protect, markBookingCompleted);
router.patch("/:id/cancel", protect, cancelBookingByFarmer);

export default router;