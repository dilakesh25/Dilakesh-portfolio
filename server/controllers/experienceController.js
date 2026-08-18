import Experience from "../models/Experience.js";

// @desc    Get all experiences
// @route   GET /api/experience
// @access  Public
export const getExperiences = async (req, res) => {
  try {
    const experiences = await Experience.find().sort({ order: 1, createdAt: -1 });
    res.status(200).json({ success: true, count: experiences.length, data: experiences });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch experiences" });
  }
};

// @desc    Create new experience
// @route   POST /api/experience
// @access  Private (Admin)
export const createExperience = async (req, res) => {
  try {
    const { company, role, startDate, endDate, description, bullets, technologies, location, type, order } = req.body;

    if (!company || !role || !startDate) {
      return res.status(400).json({
        success: false,
        error: "Company, role and start date are required",
      });
    }

    const techArray = Array.isArray(technologies)
      ? technologies
      : typeof technologies === "string"
      ? technologies.split(",").map((t) => t.trim()).filter(Boolean)
      : [];

    const bulletArray = Array.isArray(bullets)
      ? bullets
      : typeof bullets === "string"
      ? bullets.split("\n").map((b) => b.trim()).filter(Boolean)
      : [];

    const exp = await Experience.create({
      company,
      role,
      startDate,
      endDate: endDate || "Present",
      description: description || "",
      bullets: bulletArray,
      technologies: techArray,
      location: location || "Bengaluru, India",
      type: type || "job",
      order: order !== undefined ? Number(order) : 0,
    });

    res.status(201).json({ success: true, data: exp });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message || "Failed to create experience" });
  }
};

// @desc    Update experience
// @route   PUT /api/experience/:id
// @access  Private (Admin)
export const updateExperience = async (req, res) => {
  try {
    const { company, role, startDate, endDate, description, bullets, technologies, location, type, order } = req.body;

    let exp = await Experience.findById(req.params.id);
    if (!exp) {
      return res.status(404).json({ success: false, error: "Experience not found" });
    }

    const updateData = {};
    if (company !== undefined) updateData.company = company;
    if (role !== undefined) updateData.role = role;
    if (startDate !== undefined) updateData.startDate = startDate;
    if (endDate !== undefined) updateData.endDate = endDate;
    if (description !== undefined) updateData.description = description;
    if (location !== undefined) updateData.location = location;
    if (type !== undefined) updateData.type = type;
    if (order !== undefined) updateData.order = Number(order);

    if (technologies !== undefined) {
      updateData.technologies = Array.isArray(technologies)
        ? technologies
        : typeof technologies === "string"
        ? technologies.split(",").map((t) => t.trim()).filter(Boolean)
        : [];
    }

    if (bullets !== undefined) {
      updateData.bullets = Array.isArray(bullets)
        ? bullets
        : typeof bullets === "string"
        ? bullets.split("\n").map((b) => b.trim()).filter(Boolean)
        : [];
    }

    exp = await Experience.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: exp });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message || "Failed to update experience" });
  }
};

// @desc    Delete experience
// @route   DELETE /api/experience/:id
// @access  Private (Admin)
export const deleteExperience = async (req, res) => {
  try {
    const exp = await Experience.findById(req.params.id);
    if (!exp) {
      return res.status(404).json({ success: false, error: "Experience not found" });
    }

    await Experience.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Experience removed" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to delete experience" });
  }
};
