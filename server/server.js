import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import connectDB from "./config/db.js";

// Route imports
import authRoutes from "./routes/auth.js";
import projectRoutes from "./routes/projects.js";
import skillRoutes from "./routes/skills.js";
import experienceRoutes from "./routes/experience.js";
import messageRoutes from "./routes/messages.js";
import statsRoutes from "./routes/stats.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, ".env") });

const app = express();
const PORT = process.env.PORT || 5050;

// Connect to Database
connectDB();

/* ─── Middleware ─── */
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:4173",
      "http://localhost:3000",
      "http://127.0.0.1:5173",
      process.env.FRONTEND_URL,
    ].filter(Boolean),
    credentials: true,
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
  res.status(200).json({ status: "ok", message: "Portfolio Backend is running smoothly" });
});

/* ─── Serve static build in production ─── */
const distPath = join(__dirname, "..", "dist");
app.use(express.static(distPath));

// Fallback for SPA routing in production (Express 5 compatible)
app.use((req, res, next) => {
  if (req.path.startsWith("/api")) {
    return res.status(404).json({ success: false, error: "API Route not found" });
  }
  res.sendFile(join(distPath, "index.html"), (err) => {
    if (err) {
      res.status(200).send("Portfolio API Server is running. Start the Vite frontend dev server with npm run dev.");
    }
  });
});

/* ─── Error Handling Middleware ─── */
app.use((err, req, res, next) => {
  console.error("Global Server Error:", err.stack);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || "Internal Server Error",
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export default app;
