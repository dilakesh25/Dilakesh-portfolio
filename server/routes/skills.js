import { Router } from "express";
import {
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
} from "../controllers/skillController.js";
import protect from "../middleware/auth.js";

const router = Router();

// Public route
router.get("/", getSkills);

// Protected routes (Admin only)
router.post("/", protect, createSkill);
router.put("/:id", protect, updateSkill);
router.delete("/:id", protect, deleteSkill);

export default router;
