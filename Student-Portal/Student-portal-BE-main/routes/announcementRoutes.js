import express from "express";
import Announcement from "../models/Announcement.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 }).limit(10);
    
    const formatted = announcements.map(a => ({
      _id: a._id,
      type: a.type,
      title: a.title,
      description: a.description,
      date: a.date || new Date(a.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Error fetching announcements:", err);
    res.status(500).json({ error: "Failed to load announcements" });
  }
});

export default router;
