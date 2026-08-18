import Project from "../models/Project.js";
import Skill from "../models/Skill.js";
import Experience from "../models/Experience.js";
import Message from "../models/Message.js";
import Analytics from "../models/Analytics.js";

// @desc    Get dashboard metrics & stats
// @route   GET /api/dashboard/stats
// @access  Private (Admin)
export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalProjects,
      totalSkills,
      totalExperiences,
      totalMessages,
      unreadMessages,
      resumeStat,
    ] = await Promise.all([
      Project.countDocuments(),
      Skill.countDocuments(),
      Experience.countDocuments(),
      Message.countDocuments(),
      Message.countDocuments({ read: false }),
      Analytics.findOne({ key: "resume_downloads" }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalProjects,
        totalSkills,
        totalExperiences,
        totalMessages,
        unreadMessages,
        resumeDownloads: resumeStat ? resumeStat.count : 0,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to load dashboard statistics" });
  }
};

// @desc    Increment resume download count
// @route   POST /api/stats/resume-download
// @access  Public
export const recordResumeDownload = async (req, res) => {
  try {
    const stat = await Analytics.findOneAndUpdate(
      { key: "resume_downloads" },
      { $inc: { count: 1 } },
      { upsert: true, new: true }
    );

    res.status(200).json({ success: true, count: stat.count });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to record download" });
  }
};
