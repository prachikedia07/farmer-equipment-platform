import mongoose from "mongoose";

interface IReview extends mongoose.Document {
  rating: number;
  comment: string;
  farmer: mongoose.Types.ObjectId;
  equipment: mongoose.Types.ObjectId;
  booking: mongoose.Types.ObjectId;
}

const reviewSchema = new mongoose.Schema<IReview>(
  {
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String
    },
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    equipment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Equipment",
      required: true
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      unique: true // 🔥 one review per booking
    }
  },
  { timestamps: true }
);

const Review = mongoose.model<IReview>("Review", reviewSchema);

export default Review;