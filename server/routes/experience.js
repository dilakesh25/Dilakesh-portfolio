import { Router } from "express";
import {
  getExperiences,
  createExperience,
  updateExperience,
  deleteExperience,
} from "../controllers/experienceController.js";
import protect from "../middleware/auth.js";

const router = Router();

// Public route
router.get("/", getExperiences);

// Protected routes (Admin only)
router.post("/", protect, createExperience);
router.put("/:id", protect, updateExperience);
router.delete("/:id", protect, deleteExperience);

export default router;
