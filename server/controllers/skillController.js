import Skill from "../models/Skill.js";

// @desc    Get all skills
// @route   GET /api/skills
// @access  Public
export const getSkills = async (req, res) => {
  try {
    const skills = await Skill.find().sort({ order: 1, createdAt: 1 });
    res.status(200).json({ success: true, count: skills.length, data: skills });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch skills" });
  }
};

// @desc    Create new skill
// @route   POST /api/skills
// @access  Private (Admin)
export const createSkill = async (req, res) => {
  try {
    const { name, category, proficiency, order } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, error: "Skill name is required" });
    }

    const skill = await Skill.create({
      name,
      category: category || "technical",
      proficiency: proficiency || "Proficient",
      order: order !== undefined ? Number(order) : 0,
    });

    res.status(201).json({ success: true, data: skill });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message || "Failed to create skill" });
  }
};

// @desc    Update skill
// @route   PUT /api/skills/:id
// @access  Private (Admin)
export const updateSkill = async (req, res) => {
  try {
    const { name, category, proficiency, order } = req.body;

    let skill = await Skill.findById(req.params.id);
    if (!skill) {
      return res.status(404).json({ success: false, error: "Skill not found" });
    }

    skill = await Skill.findByIdAndUpdate(
      req.params.id,
      {
        ...(name && { name }),
        ...(category && { category }),
        ...(proficiency && { proficiency }),
        ...(order !== undefined && { order: Number(order) }),
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: skill });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message || "Failed to update skill" });
  }
};

// @desc    Delete skill
// @route   DELETE /api/skills/:id
// @access  Private (Admin)
export const deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      return res.status(404).json({ success: false, error: "Skill not found" });
    }

    await Skill.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Skill removed" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to delete skill" });
  }
};
