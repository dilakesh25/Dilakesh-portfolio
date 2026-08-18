import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user by id or email attached to token
      const user = await User.findById(decoded.id).select("-password");
      if (!user && decoded.email !== process.env.ADMIN_EMAIL) {
        return res.status(401).json({ success: false, error: "Not authorized, user not found" });
      }

      req.user = user || { email: decoded.email, role: "admin" };
      return next();
    } catch (error) {
      console.error("JWT Verification error:", error.message);
      return res.status(401).json({ success: false, error: "Not authorized, token invalid or expired" });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, error: "Not authorized, no token provided" });
  }
};

export default protect;
