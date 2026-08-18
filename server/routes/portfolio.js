import { Router } from "express";
import Skill from "../models/Skill.js";
import Experience from "../models/Experience.js";
import Education from "../models/Education.js";

const router = Router();

// GET /api/portfolio — public: return all portfolio data
router.get("/", async (_req, res) => {
  try {
    const [skills, experience, education] = await Promise.all([
      Skill.find().sort({ order: 1 }),
      Experience.find().sort({ order: 1 }),
      Education.find().sort({ order: 1 }),
    ]);
    res.json({ skills, experience, education });
  } catch (err) {
    res.status(500).json({ error: "Failed to load portfolio data" });
  }
});

export default router;
