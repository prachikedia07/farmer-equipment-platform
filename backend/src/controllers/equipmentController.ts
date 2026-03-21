import { Request, Response } from "express";
import Equipment from "../models/Equipment";

// 1. Add Equipment (Owner only)
export const addEquipment = async (req: any, res: Response) => {
  try {
    const equipment = await Equipment.create({
      ...req.body,
      owner: req.user._id
    });

    res.status(201).json(equipment);
  } catch (error) {
    res.status(500).json({ message: "Error adding equipment" });
  }
};

// 2. Get all equipment (Farmer view)
export const getAllEquipment = async (req: Request, res: Response) => {
  try {
    const { search, category, location, minPrice, maxPrice } = req.query;

    let filter: any = {};

    // 🔍 search by name or owner (basic)
    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    // 🧰 category filter
    if (category && category !== "all") {
      filter.category = category;
    }

    // 📍 location filter
    if (location && location !== "all") {
      filter.location = { $regex: location, $options: "i" };
    }

    // 💰 price filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const equipment = await Equipment.find(filter).populate(
      "owner",
      "name phone"
    );

    res.json(equipment);

  } catch (error) {
    res.status(500).json({ message: "Error fetching equipment" });
  }
};

// 3. Get single equipment
export const getEquipmentById = async (req: Request, res: Response) => {
  try {
    const equipment = await Equipment.findById(req.params.id).populate(
      "owner",
      "name phone"
    );

    if (!equipment) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json(equipment);
  } catch (error) {
    res.status(500).json({ message: "Error fetching equipment" });
  }
};

// 4. Update equipment (Owner only)
export const updateEquipment = async (req: any, res: Response) => {
  try {
    const equipment = await Equipment.findById(req.params.id);

    if (!equipment) {
      return res.status(404).json({ message: "Not found" });
    }

    // ownership check
    if (equipment.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    // allowed fields
    const allowedUpdates = [
      "name",
      "category",
      "price",
      "pricingType",
      "location",
      "availability",
      "image"
    ];

    const updates = Object.keys(req.body);

    const isValid = updates.every((field) =>
      allowedUpdates.includes(field)
    );

    if (!isValid) {
      return res.status(400).json({
        message: "Invalid fields in update"
      });
    }

    // apply updates
    updates.forEach((field) => {
      (equipment as any)[field] = req.body[field];
    });

    const updatedEquipment = await equipment.save();

    res.json(updatedEquipment);

  } catch (error: any) {
    console.error(error);

    res.status(400).json({
      message: error.message
    });
  }
};

// 5. Delete equipment
export const deleteEquipment = async (req: any, res: Response) => {
  try {
    const equipment = await Equipment.findById(req.params.id);

    if (!equipment) {
      return res.status(404).json({ message: "Not found" });
    }

    if (equipment.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await equipment.deleteOne();

    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting equipment" });
  }
};