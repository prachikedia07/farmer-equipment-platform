import { Request, Response } from "express";
import Booking from "../models/Booking";
import Equipment from "../models/Equipment";

export const createBooking = async (req: any, res: Response) => {
  try {
    const { equipmentId, date, startTime, duration } = req.body;

    const equipment = await Equipment.findById(equipmentId);

    if (!equipment) {
      return res.status(404).json({ message: "Equipment not found" });
    }

    // 🧠 calculate end time (simple numeric for now)
    const newStart = Number(startTime);
    const newEnd = newStart + Number(duration);

    // 🔥 check overlap
    const existingBookings = await Booking.find({
      equipment: equipmentId,
      date,
      status: { $in: ["pending", "accepted"] }
    });

    const isConflict = existingBookings.some((b: any) => {
      const existingStart = Number(b.startTime);
      const existingEnd = existingStart + b.duration;

      return newStart < existingEnd && newEnd > existingStart;
    });

    if (isConflict) {
      return res.status(400).json({
        message: "Time slot not available"
      });
    }

    // 💰 price calculation
    let totalPrice = equipment.price * duration;

    const booking = await Booking.create({
      farmer: req.user._id,
      owner: equipment.owner,
      equipment: equipmentId,
      date,
      startTime,
      duration,
      totalPrice
    });

    res.status(201).json(booking);

  } catch (error: any) {
  console.error("BOOKING ERROR:", error);

  res.status(500).json({
    message: error.message
  });
}
};

export const getMyBookings = async (req: any, res: Response) => {
  try {
    const bookings = await Booking.find({ farmer: req.user._id })
      .populate("equipment")
      .populate("owner", "name phone");

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings" });
  }
};

export const getOwnerBookings = async (req: any, res: Response) => {
  try {
    const bookings = await Booking.find({
      owner: req.user._id
    })
      .populate("equipment")
      .populate("farmer", "name");

    res.json(bookings);

  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings" });
  }
};

export const updateBookingStatus = async (req: any, res: Response) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Not found" });
    }

    // only owner can update
    if (booking.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const allowed = ["accepted", "rejected"];

    if (!allowed.includes(req.body.status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    booking.status = req.body.status;

    await booking.save();

    res.json(booking);

  } catch (error) {
    res.status(500).json({ message: "Error updating booking" });
  }
};

export const markBookingCompleted = async (req: any, res: Response) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Not found" });
    }

    // only owner can mark complete
    if (booking.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    // only accepted bookings can be completed
    if (booking.status !== "accepted") {
      return res.status(400).json({
        message: "Only accepted bookings can be completed"
      });
    }

    booking.status = "completed";

    await booking.save();

    res.json(booking);

  } catch (error) {
    res.status(500).json({ message: "Error completing booking" });
  }
};

export const cancelBookingByFarmer = async (req: any, res: Response) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Not found" });
    }

    // ✅ only farmer who created booking
    if (booking.farmer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    // ❌ cannot cancel completed
    if (booking.status === "completed") {
      return res.status(400).json({
        message: "Completed booking cannot be cancelled"
      });
    }

    booking.status = "cancelled";

    await booking.save();

    res.json({ message: "Booking cancelled", booking });

  } catch (error) {
    res.status(500).json({ message: "Error cancelling booking" });
  }
};