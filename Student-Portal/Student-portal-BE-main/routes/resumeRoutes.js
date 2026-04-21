import express from "express";
import multer from "multer";
import fs from "fs";
import { verifyToken } from "../middleware/auth.js";
import { analyzeResume } from "../services/resumeAnalyzer.js";
import Resume from "../models/Resume.js";
import Student from "../models/Student.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") cb(null, true);
    else cb(new Error("Only PDF files are allowed"), false);
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

// ── Upload & Analyze Resume ──────────────────────────────────────────────────
router.post("/upload", verifyToken, upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No PDF file uploaded" });

    const filePath = req.file.path;
    const analysis = await analyzeResume(filePath);

    // Upsert: one resume doc per user
    let resume = await Resume.findOne({ userId: req.userId });
    if (resume) {
      Object.assign(resume, {
        ...analysis,
        filename: req.file.originalname,
        analyzedAt: new Date(),
      });
      await resume.save();
    } else {
      resume = await Resume.create({
        userId: req.userId,
        filename: req.file.originalname,
        ...analysis,
      });
    }

    // Keep Student.skills in sync for recommendation engine
    await Student.findByIdAndUpdate(req.userId, {
      skills: analysis.skills,
      resumeId: resume._id,
    });

    // Cleanup temp file
    fs.unlinkSync(filePath);

    res.json({ message: "Resume analyzed successfully", data: resume });
  } catch (err) {
    console.error("Resume analysis error:", err);
    res.status(500).json({ error: "Resume analysis failed: " + err.message });
  }
});

// ── Get current user's latest resume analysis ────────────────────────────────
router.get("/my", verifyToken, async (req, res) => {
  try {
    const resume = await Resume.findOne({ userId: req.userId }).sort({ analyzedAt: -1 });
    if (!resume) return res.status(404).json({ error: "No resume found" });
    res.json(resume);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch resume" });
  }
});

export default router;
