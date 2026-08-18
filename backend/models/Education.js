import mongoose from "mongoose";

const educationSchema = new mongoose.Schema({
  degree: { type: String, required: true, trim: true },
  institution: { type: String, required: true, trim: true },
  year: { type: String, required: true },
  score: { type: String },
  scoreType: { type: String, enum: ["CGPA", "percentage"], default: "CGPA" },
  level: { type: String, enum: ["primary", "secondary"], default: "primary" },
  order: { type: Number, default: 0 },
});

export default mongoose.model("Education", educationSchema);
