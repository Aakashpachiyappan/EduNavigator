import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Student from "../models/Student.js";
import { verifyToken, requireRole } from "../middleware/auth.js";

const router = express.Router();

// ── Register ────────────────────────────────────────────────────────────────
router.post("/register", async (req, res) => {
  const { name, email, password, department, role } = req.body;
  try {
    const existing = await Student.findOne({ email });
    if (existing) return res.status(400).json({ error: "Email already in use" });

    // Prevent direct superadmin registration via API
    if (role === "superadmin")
      return res.status(403).json({ error: "Cannot self-register as superadmin" });

    const hashed = await bcrypt.hash(password, 10);

    // Admins start as pending — need superadmin approval before login
    const isAdmin  = role === "admin";
    const newStudent = new Student({
      name, email, department,
      password: hashed,
      role:   isAdmin ? "admin"   : "student",
      status: isAdmin ? "pending" : "active",
    });
    await newStudent.save();

    const msg = isAdmin
      ? "Admin registration submitted. Please wait for superadmin approval before logging in."
      : "Registered successfully";
    res.status(201).json({ message: msg, pending: isAdmin });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ── Login ────────────────────────────────────────────────────────────────────
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const student = await Student.findOne({ email });
    if (!student) return res.status(404).json({ error: "User not found" });

    const valid = await bcrypt.compare(password, student.password);
    if (!valid) return res.status(401).json({ error: "Invalid password" });

    // Block pending admins
    if (student.status === "pending")
      return res.status(403).json({ error: "Your admin account is pending superadmin approval. Please wait." });

    // Block rejected admins
    if (student.status === "rejected")
      return res.status(403).json({ error: "Your admin registration was rejected. Contact superadmin." });

    const token = jwt.sign(
      { id: student._id, role: student.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const { password: _pw, ...safeStudent } = student.toObject();
    res.json({ token, student: safeStudent });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
});

// ── Get current user (protected) ────────────────────────────────────────────
router.get("/me", verifyToken, async (req, res) => {
  try {
    const student = await Student.findById(req.userId).select("-password");
    if (!student) return res.status(404).json({ error: "User not found" });
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// ── Get all students (admin/superadmin) ──────────────────────────────────────
router.get("/all", verifyToken, async (req, res) => {
  try {
    const users = await Student.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch students" });
  }
});

// ══ SUPERADMIN ROUTES ════════════════════════════════════════════════════════

// Get all pending admin registrations
router.get("/pending-admins", verifyToken, requireRole("superadmin"), async (req, res) => {
  try {
    const pending = await Student.find({ role: "admin", status: "pending" })
      .select("-password")
      .sort({ createdAt: -1 });
    res.json(pending);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch pending admins" });
  }
});

// Approve a pending admin
router.patch("/approve-admin/:id", verifyToken, requireRole("superadmin"), async (req, res) => {
  try {
    const admin = await Student.findByIdAndUpdate(
      req.params.id,
      { status: "active" },
      { new: true }
    ).select("-password");
    if (!admin) return res.status(404).json({ error: "User not found" });
    res.json({ message: `${admin.name} approved as admin`, admin });
  } catch (err) {
    res.status(500).json({ error: "Failed to approve admin" });
  }
});

// Reject a pending admin
router.patch("/reject-admin/:id", verifyToken, requireRole("superadmin"), async (req, res) => {
  try {
    const admin = await Student.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    ).select("-password");
    if (!admin) return res.status(404).json({ error: "User not found" });
    res.json({ message: `${admin.name}'s request rejected`, admin });
  } catch (err) {
    res.status(500).json({ error: "Failed to reject admin" });
  }
});

// Revoke an active admin (reset to pending)
router.patch("/revoke-admin/:id", verifyToken, requireRole("superadmin"), async (req, res) => {
  try {
    const admin = await Student.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    ).select("-password");
    res.json({ message: `${admin.name}'s admin access revoked` });
  } catch (err) {
    res.status(500).json({ error: "Failed to revoke admin" });
  }
});

// Get all approved admins
router.get("/approved-admins", verifyToken, requireRole("superadmin"), async (req, res) => {
  try {
    const admins = await Student.find({ role: "admin", status: "active" })
      .select("-password")
      .sort({ createdAt: -1 });
    res.json(admins);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch admins" });
  }
});

export default router;
