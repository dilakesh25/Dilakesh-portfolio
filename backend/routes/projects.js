import { Router } from "express";
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from "../controllers/projectController.js";
import protect from "../middleware/auth.js";

const router = Router();

// Public routes
router.get("/", getProjects);
router.get("/:id", getProjectById);

// Protected routes (Admin only)
router.post("/", protect, createProject);
router.put("/:id", protect, updateProject);
router.delete("/:id", protect, deleteProject);

export default router;
