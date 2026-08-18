import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "../backend/config/db.js";

// Route imports
import authRoutes from "../backend/routes/auth.js";
import projectRoutes from "../backend/routes/projects.js";
import skillRoutes from "../backend/routes/skills.js";
import experienceRoutes from "../backend/routes/experience.js";
import messageRoutes from "../backend/routes/messages.js";
import statsRoutes from "../backend/routes/stats.js";

dotenv.config();

const app = express();

// Middleware to ensure DB connection on every request
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("Database connection error in middleware:", err);
    res.status(500).json({ success: false, error: "Database connection failed" });
  }
});

/* ─── Middleware ─── */
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ─── API Routes ─── */
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/experience", experienceRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/dashboard", statsRoutes);
app.use("/api/stats", statsRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Portfolio Backend running on Vercel" });
});

/* ─── Error Handling Middleware ─── */
app.use((err, req, res, next) => {
  console.error("Serverless API Error:", err.stack);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || "Internal Server Error",
  });
});

export default app;
