import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    role: {
      type: String,
      required: [true, "Role is required"],
      trim: true,
    },
    startDate: {
      type: String,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: String,
      default: "Present",
    },
    description: {
      type: String,
      default: "",
    },
    bullets: {
      type: [String],
      default: [],
    },
    technologies: {
      type: [String],
      default: [],
    },
    location: {
      type: String,
      default: "Bengaluru, India",
    },
    type: {
      type: String,
      enum: ["job", "training", "internship"],
      default: "job",
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Experience = mongoose.model("Experience", experienceSchema);
export default Experience;
