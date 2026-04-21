import express from "express";
import { verifyToken } from "../middleware/auth.js";
import JobApplication from "../models/JobApplication.js";
import InterviewSession from "../models/InterviewSession.js";

const router = express.Router();

router.get("/", verifyToken, async (req, res) => {
  try {
    const studentId = req.userId;

    // Fetch total job applications
    const applications = await JobApplication.find({ studentId }).sort({ createdAt: -1 });
    
    const accepted = applications.filter(a => a.status === 'accepted').length;
    const pending = applications.filter(a => a.status === 'pending').length;
    const rejected = applications.filter(a => a.status === 'rejected').length;

    // Format for bar chart (last 7 days grouped by date)
    const applicationsOverTimeMap = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      applicationsOverTimeMap[dateStr] = 0;
    }
    applications.forEach(app => {
      const dateStr = new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (applicationsOverTimeMap[dateStr] !== undefined) {
        applicationsOverTimeMap[dateStr] += 1;
      }
    });

    const applicationsOverTime = Object.keys(applicationsOverTimeMap).map(date => ({
      date,
      count: applicationsOverTimeMap[date]
    }));

    // Fetch mock interviews count
    const interviewsCount = await InterviewSession.countDocuments({ studentId });

    res.json({
      totalApplications: applications.length,
      applicationsByStatus: {
        accepted,
        pending,
        rejected
      },
      interviewSessions: interviewsCount,
      recentApplications: applications.slice(0, 5),
      applicationsOverTime
    });

  } catch (err) {
    console.error("Error fetching dashboard stats:", err);
    res.status(500).json({ error: "Failed to load dashboard stats" });
  }
});

export default router;
