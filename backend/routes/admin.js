import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import auth from "../middleware/auth.js";
import Contact from "../models/Contact.js";
import Skill from "../models/Skill.js";
import Experience from "../models/Experience.js";
import Education from "../models/Education.js";

const router = Router();

/* ─── Auth ─── */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email !== process.env.ADMIN_EMAIL) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    // Compare with hashed password, or plain-text fallback for first run
    const storedPw = process.env.ADMIN_PASSWORD;
    const valid = storedPw.startsWith("$2")
      ? await bcrypt.compare(password, storedPw)
      : password === storedPw;

    if (!valid) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});

/* ─── Messages ─── */
router.get("/messages", auth, async (_req, res) => {
  const messages = await Contact.find().sort({ createdAt: -1 });
  res.json(messages);
});

router.patch("/messages/:id/read", auth, async (req, res) => {
  const msg = await Contact.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
  res.json(msg);
});

router.delete("/messages/:id", auth, async (req, res) => {
  await Contact.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

/* ─── Generic CRUD helper ─── */
function crud(model) {
  const r = Router();
  r.get("/", async (_req, res) => res.json(await model.find().sort({ order: 1 })));
  r.post("/", async (req, res) => {
    const doc = await model.create(req.body);
    res.status(201).json(doc);
  });
  r.put("/:id", async (req, res) => {
    const doc = await model.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(doc);
  });
  r.delete("/:id", async (req, res) => {
    await model.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  });
  return r;
}

router.use("/skills", auth, crud(Skill));
router.use("/experience", auth, crud(Experience));
router.use("/education", auth, crud(Education));

export default router;
