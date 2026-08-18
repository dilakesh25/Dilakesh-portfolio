import { Router } from "express";
import {
  createMessage,
  getMessages,
  markMessageAsRead,
  deleteMessage,
} from "../controllers/messageController.js";
import protect from "../middleware/auth.js";

const router = Router();

// Public route: submit contact message
router.post("/", createMessage);

// Protected routes (Admin only)
router.get("/", protect, getMessages);
router.patch("/:id/read", protect, markMessageAsRead);
router.delete("/:id", protect, deleteMessage);

export default router;
