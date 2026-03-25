import { Request, Response } from "express";
import User from "../models/User";
import Booking from "../models/Booking";
import Equipment from "../models/Equipment";

export const getAdminDashboard = async (req: Request, res: Response) => {
  try {
    // TOTAL COUNTS
    const totalFarmers = await User.countDocuments({ role: "farmer" });
    const totalOwners = await User.countDocuments({ role: "owner" });
    const totalBookings = await Booking.countDocuments();

    // TOTAL REVENUE + COMMISSION (10%)
    const completedBookings = await Booking.find({ status: "completed" });

    const totalRevenue = completedBookings.reduce(
      (sum, b: any) => sum + (b.totalPrice || 0),
      0
    );

    const commission = Math.floor(totalRevenue * 0.1);

    // RECENT BOOKINGS
    const recentBookings = await Booking.find()
      .populate("farmer", "name")
      .populate("owner", "name")
      .populate("equipment", "name")
      .sort({ createdAt: -1 })
      .limit(5);

    // MONTHLY BOOKINGS (last 6 months)
    const monthlyBookingsRaw = await Booking.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          bookings: { $sum: 1 },
        },
      },
      { $sort: { "_id": 1 } },
    ]);

    const monthsMap: any = {
      1: "Jan", 2: "Feb", 3: "Mar", 4: "Apr",
      5: "May", 6: "Jun", 7: "Jul", 8: "Aug",
      9: "Sep", 10: "Oct", 11: "Nov", 12: "Dec",
    };

    const monthlyBookings = monthlyBookingsRaw.map((m: any) => ({
      month: monthsMap[m._id],
      bookings: m.bookings,
    }));

    // EQUIPMENT DISTRIBUTION
    const equipmentStatsRaw = await Equipment.aggregate([
      {
        $group: {
          _id: "$category",
          value: { $sum: 1 },
        },
      },
    ]);

    const equipmentStats = equipmentStatsRaw.map((e: any) => ({
      name: e._id,
      value: e.value,
    }));

    // TOP LOCATIONS
    const topLocations = await Booking.aggregate([
  {
    $match: {
      equipment: { $ne: null }
    }
  },

  {
    $lookup: {
      from: "equipment",
      localField: "equipment",
      foreignField: "_id",
      as: "equipment"
    }
  },

  { $unwind: "$equipment" },

  {
    $group: {
      _id: "$equipment.location",
      bookings: { $sum: 1 }
    }
  },

  { $sort: { bookings: -1 } },
  { $limit: 5 }
]);

    res.json({
      totalFarmers,
      totalOwners,
      totalBookings,
      commission,
      monthlyBookings,
      equipmentStats,
      recentBookings,
      topLocations,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Admin dashboard error" });
  }
};