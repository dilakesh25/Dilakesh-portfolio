import { Router } from "express";
import Contact from "../models/Contact.js";

const router = Router();

// POST /api/contact — public: save a visitor message
router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: "Name, email and message are required" });
    }
    const contact = await Contact.create({ name, email, message });
    res.status(201).json({ success: true, id: contact._id });
  } catch (err) {
    res.status(500).json({ error: "Failed to save message" });
  }
});

export default router;
