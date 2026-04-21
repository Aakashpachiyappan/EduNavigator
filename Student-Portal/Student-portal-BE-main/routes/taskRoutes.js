import express from "express";
import { verifyToken } from "../middleware/auth.js";
import Task from "../models/Task.js";

const router = express.Router();

router.get("/", verifyToken, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.userId }).sort({ dueDate: 1 });
    
    // Process due dates strings nicely
    const formattedTasks = tasks.map(t => ({
      _id: t._id,
      title: t.title,
      subject: t.subject,
      status: t.status,
      due: t.dueDate ? new Date(t.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No Due Date'
    }));

    res.json(formattedTasks);
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ error: "Failed to load tasks" });
  }
});

export default router;
