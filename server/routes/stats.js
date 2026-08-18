import { Router } from "express";
import {
  getDashboardStats,
  recordResumeDownload,
} from "../controllers/statsController.js";
import protect from "../middleware/auth.js";

const router = Router();

// Protected dashboard stats
router.get("/stats", protect, getDashboardStats);

// Public stats increment
router.post("/resume-download", recordResumeDownload);

export default router;
