import express from "express";
import {
  addEquipment,
  getAllEquipment,
  getEquipmentById,
  updateEquipment,
  deleteEquipment
} from "../controllers/equipmentController";

import { protect } from "../middleware/middleware";
import { authorize } from "../middleware/roleMiddleware";

const router = express.Router();

// Public
router.get("/", getAllEquipment);
router.get("/:id", getEquipmentById);

// Owner only
router.post("/", protect, authorize("owner"), addEquipment);
router.patch("/:id", protect, authorize("owner"), updateEquipment);
router.delete("/:id", protect, authorize("owner"), deleteEquipment);

export default router;