import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Generate JWT helper
const generateToken = (id, email) => {
  return jwt.sign({ id, email }, process.env.JWT_SECRET || "default_jwt_secret", {
    expiresIn: "7d",
  });
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Please provide both email and password",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if admin user exists in DB
    let user = await User.findOne({ email: normalizedEmail });

    // Fallback: If no user in DB yet, check against env variables and auto-seed admin user
    if (!user && process.env.ADMIN_EMAIL && normalizedEmail === process.env.ADMIN_EMAIL.toLowerCase()) {
      if (password === process.env.ADMIN_PASSWORD) {
        user = await User.create({
          email: normalizedEmail,
          password: process.env.ADMIN_PASSWORD,
          role: "admin",
        });
      }
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password",
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password",
      });
    }

    const token = generateToken(user._id, user.email);

    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      error: "Server error during authentication",
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private (Admin)
export const getMe = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
