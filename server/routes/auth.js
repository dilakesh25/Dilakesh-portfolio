import { Router } from "express";
import { login, getMe } from "../controllers/authController.js";
import protect from "../middleware/auth.js";

const router = Router();

// POST /api/auth/login
router.post("/login", login);

// GET /api/auth/me (Protected)
router.get("/me", protect, getMe);

export default router;
