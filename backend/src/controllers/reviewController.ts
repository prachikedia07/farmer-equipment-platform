import { Request, Response } from "express";
import Review from "../models/Review";
import Booking from "../models/Booking";
import Equipment from "../models/Equipment";

export const addReview = async (req: any, res: Response) => {
  try {
    const { bookingId, rating, comment } = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.farmer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    if (booking.status !== "completed") {
      return res.status(400).json({
        message: "Review allowed only after completion"
      });
    }

    // ✅ PREVENT DUPLICATE (IMPORTANT)
    const existing = await Review.findOne({ booking: bookingId });

    if (existing) {
      return res.status(400).json({
        message: "You already reviewed this booking"
      });
    }

    const review = await Review.create({
      rating,
      comment,
      farmer: req.user._id,
      equipment: booking.equipment,
      booking: bookingId
    });

    // ⭐ update rating
    const reviews = await Review.find({ equipment: booking.equipment });

    const avgRating =
      reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

    await Equipment.findByIdAndUpdate(booking.equipment, {
      rating: avgRating,
      numReviews: reviews.length
    });

    res.status(201).json(review);

  } catch (error: any) {

    // ✅ HANDLE DUPLICATE ERROR (CRITICAL)
    if (error.code === 11000) {
      return res.status(400).json({
        message: "You already reviewed this booking"
      });
    }

    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const getReviewsByEquipment = async (req: Request, res: Response) => {
  try {
    const reviews = await Review.find({
      equipment: req.params.id
    }).populate("farmer", "name");

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reviews" });
  }
};

export const deleteReview = async (req: any, res: Response) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // only farmer who created
    if (review.farmer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await review.deleteOne();

    // ✅ recalc rating
    const reviews = await Review.find({ equipment: review.equipment });

    const avgRating =
      reviews.length === 0
        ? 0
        : reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

    await Equipment.findByIdAndUpdate(review.equipment, {
      rating: avgRating,
      numReviews: reviews.length
    });

    res.json({ message: "Review deleted" });

  } catch (error) {
    res.status(500).json({ message: "Error deleting review" });
  }
};