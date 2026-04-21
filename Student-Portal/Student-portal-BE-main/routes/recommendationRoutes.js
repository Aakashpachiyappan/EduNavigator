import express from "express";
import { verifyToken } from "../middleware/auth.js";
import Student from "../models/Student.js";
import Resume from "../models/Resume.js";
import JobBoard from "../models/JobBoard.js";

const router = express.Router();

// ── GET /api/recommendations ──────────────────────────────────────────────────
// Returns all jobs ranked by skill-match score for the authenticated user.
router.get("/", verifyToken, async (req, res) => {
  try {
    // Gather user skills from Student doc + latest Resume
    const student = await Student.findById(req.userId);
    const resume = await Resume.findOne({ userId: req.userId }).sort({ analyzedAt: -1 });

    const userSkills = [
      ...(student?.skills || []),
      ...(resume?.skills || []),
    ].map((s) => s.toLowerCase());

    const jobs = await JobBoard.find().sort({ createdAt: -1 });

    const ranked = jobs.map((job) => {
      const jobSkillsLower = (job.skills || []).map((s) => s.toLowerCase());
      const matchedSkills = jobSkillsLower.filter((s) => userSkills.includes(s));
      const matchScore =
        jobSkillsLower.length > 0
          ? Math.round((matchedSkills.length / jobSkillsLower.length) * 100)
          : 0;

      return {
        ...job.toObject(),
        matchScore,
        matchedSkills: job.skills.filter((s) =>
          userSkills.includes(s.toLowerCase())
        ),
      };
    });

    // Sort descending by match score
    ranked.sort((a, b) => b.matchScore - a.matchScore);

    res.json(ranked);
  } catch (err) {
    console.error("Recommendations error:", err);
    res.status(500).json({ error: "Failed to generate recommendations" });
  }
});

export default router;
