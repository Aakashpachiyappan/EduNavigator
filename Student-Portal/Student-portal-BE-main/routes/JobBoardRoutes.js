import express from "express";
import JobBoardSchema from "../models/JobBoard.js";
import JobApplication from "../models/JobApplication.js";
import Notification from "../models/Notification.js";
import { verifyToken, requireRole } from "../middleware/auth.js";
import { getIO } from "../socket.js";
import Student from "../models/Student.js";
import { sendJobNotification } from "../services/emailService.js";

const JobBoardRouter = express.Router();

// ── Create job (auth required) ────────────────────────────────────────────────
JobBoardRouter.post("/", verifyToken, async (req, res) => {
  try {
    const { role, company, location, contact, description, skills, type } = req.body;
    const newJobPost = new JobBoardSchema({
      role, company, location, contact,
      description: description || "",
      skills: skills || [],
      type: type || "Full-time",
    });
    await newJobPost.save();

    await Notification.create({
      userId: null,
      type: "job",
      message: `🚀 New job: ${role} at ${company} (${location})`,
      link: "/jobs",
    });

    try {
      getIO().emit("new-job", { message: `🚀 New job posted: ${role} at ${company}`, job: newJobPost });
    } catch (_) {}

    // Email all registered students (fire-and-forget)
    Student.find({ role: "student", status: "active" }).select("email name").lean()
      .then(students => sendJobNotification(students, newJobPost))
      .catch(() => {});

    res.status(201).json(newJobPost);
  } catch (error) {
    res.status(500).json({ message: "Error creating job", error });
  }
});

// ── Get all jobs ──────────────────────────────────────────────────────────────
JobBoardRouter.get("/", async (req, res) => {
  try {
    const jobs = await JobBoardSchema.find().sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching jobs", error });
  }
});

// ── Delete job (admin only) ───────────────────────────────────────────────────
JobBoardRouter.delete("/:id", verifyToken, requireRole("admin"), async (req, res) => {
  try {
    await JobBoardSchema.findByIdAndDelete(req.params.id);
    // Also remove all applications for this job
    await JobApplication.deleteMany({ jobId: req.params.id });
    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting job", error });
  }
});

// ── Apply for a job (student) ─────────────────────────────────────────────────
JobBoardRouter.post("/:id/apply", verifyToken, async (req, res) => {
  try {
    const job = await JobBoardSchema.findById(req.params.id);
    if (!job) return res.status(404).json({ error: "Job not found" });

    const existing = await JobApplication.findOne({
      jobId: req.params.id,
      studentId: req.user._id,
    });
    if (existing) return res.status(409).json({ error: "You have already applied for this job" });

    const application = await JobApplication.create({
      jobId:        req.params.id,
      jobRole:      job.role,
      company:      job.company,
      studentId:    req.user._id,
      studentName:  req.user.name,
      studentEmail: req.user.email,
      department:   req.user.department || "",
      coverNote:    req.body.coverNote || "",
    });

    res.status(201).json({ message: "Application submitted successfully", application });
  } catch (error) {
    res.status(500).json({ message: "Error submitting application", error });
  }
});

// ── Check if current user applied for a job ───────────────────────────────────
JobBoardRouter.get("/:id/applied", verifyToken, async (req, res) => {
  try {
    const app = await JobApplication.findOne({
      jobId: req.params.id,
      studentId: req.user._id,
    });
    res.json({ applied: !!app, application: app });
  } catch (error) {
    res.status(500).json({ error: "Error checking application" });
  }
});

// ── Get applicants for a specific job (admin only) ────────────────────────────
JobBoardRouter.get("/:id/applications", verifyToken, requireRole("admin"), async (req, res) => {
  try {
    const applications = await JobApplication.find({ jobId: req.params.id })
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: "Error fetching applications", error });
  }
});

// ── Get ALL applications across all jobs (admin only) ─────────────────────────
JobBoardRouter.get("/applications/all", verifyToken, requireRole("admin"), async (req, res) => {
  try {
    // Group by company/job with student lists
    const applications = await JobApplication.find()
      .populate("jobId", "role company location type skills")
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: "Error fetching all applications", error });
  }
});

// ── Update application status (admin only) ────────────────────────────────────
JobBoardRouter.patch("/applications/:appId/status", verifyToken, requireRole("admin"), async (req, res) => {
  try {
    const { status } = req.body;
    if (!["pending", "accepted", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }
    const app = await JobApplication.findByIdAndUpdate(
      req.params.appId,
      { status },
      { new: true }
    );
    res.json(app);
  } catch (error) {
    res.status(500).json({ message: "Error updating status", error });
  }
});

// ── Get my applications (student) ─────────────────────────────────────────────
JobBoardRouter.get("/applications/mine", verifyToken, async (req, res) => {
  try {
    const applications = await JobApplication.find({ studentId: req.user._id })
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: "Error fetching applications", error });
  }
});

export default JobBoardRouter;