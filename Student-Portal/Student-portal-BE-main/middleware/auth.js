import jwt from "jsonwebtoken";
import Student from "../models/Student.js";

export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "No token provided" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId   = decoded.id;
    req.userRole = decoded.role;

    // Populate req.user for routes that need name/email/department
    const student = await Student.findById(decoded.id).select("-password");
    if (student) {
      req.user = student;
    } else {
      req.user = { _id: decoded.id, role: decoded.role, name: "Unknown", email: "", department: "" };
    }

    next();
  } catch (err) {
    res.status(403).json({ error: "Invalid token" });
  }
};

/**
 * requireRole(role) — accepts a single role string OR an array of roles.
 * Usage:
 *   requireRole("admin")
 *   requireRole(["admin", "superadmin"])
 */
export const requireRole = (roles) => (req, res, next) => {
  if (!req.userRole) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  const allowed = Array.isArray(roles) ? roles : [roles];
  if (!allowed.includes(req.userRole)) {
    return res.status(403).json({ error: `Access denied. Required role: ${allowed.join(" or ")}` });
  }
  next();
};
