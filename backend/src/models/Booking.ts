import mongoose from "mongoose";

export type BookingStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "completed";

interface IBooking extends mongoose.Document {
  farmer: mongoose.Types.ObjectId;
  owner: mongoose.Types.ObjectId;
  equipment: mongoose.Types.ObjectId;

  date: string;
  startTime: string;
  duration: number;

  totalPrice: number;

  status: BookingStatus;
}

const bookingSchema = new mongoose.Schema<IBooking>(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    equipment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Equipment",
      required: true
    },

    date: {
      type: String,
      required: true
    },
    startTime: {
      type: String,
      required: true
    },
    duration: {
      type: Number,
      required: true
    },

    totalPrice: {
      type: Number,
      required: true
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "completed"],
      default: "pending"
    }
  },
  { timestamps: true }
);

const Booking = mongoose.model<IBooking>("Booking", bookingSchema);

export default Booking;