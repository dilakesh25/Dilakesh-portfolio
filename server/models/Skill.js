import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Skill name is required"],
      trim: true,
    },
    category: {
      type: String,
      default: "technical", // "technical" | "competency" | "tools" | "database"
      trim: true,
    },
    proficiency: {
      type: String,
      default: "Proficient",
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

const Skill = mongoose.model("Skill", skillSchema);
export default Skill;
